#Utilities module for helper functions
import json
import copy
import datetime
import numbers
from operator import itemgetter
from collections.abc import MutableMapping
from importlib import import_module
from pprint import pformat

from SensorData import SensorData

def hash_numbers( a: int, b: int) -> int:
    #Szudzik's hashing function see http://szudzik.com/ElegantPairing.pdf

    A = (2 * a if a >= 0  else -2 * a - 1)
    B = (2 * b if b >= 0 else -2 * b - 1)
    C = ((A * A + A + B if A >= B else A + B * B) / 2)

    return C if (a < 0 and b < 0) or (a >= 0 and b >= 0) else -C - 1


def convert_to_dateTime(data: SensorData):

    date = datetime.date(data.date.year,data.date.month, data.date.day)
    seconds = int(data.time.second/1000)
    milliseconds = data.time.second - seconds * 1000
    time = datetime.time(data.time.hour, data.time.minute, seconds, milliseconds*1000)
    return datetime.datetime.combine(date, time)

def create_instance(objcls, settings, *args, **kwargs):

    if hasattr(objcls, 'from_settings'):
        instance = objcls.from_settings(settings, *args, **kwargs)
        method_name = 'from_settings'
    else:
        instance = objcls(*args, **kwargs)
        method_name = '__new__'

    if instance is None:
        raise TypeError(f"{objcls.__qualname__}.{method_name} returned None")

    return instance

def load_object(path):

    if not isinstance(path, str):
        if callable(path):
            return path
        else:
            raise TypeError(f"Unexpected argument type, expected string or object, got: {type(path)}")

    try:
        dot = path.rindex('.')
    except ValueError:
        raise ValueError(f"Error loading object '{path}': not a full path")

    module, name = path[:dot], path[dot + 1:]
    mod = import_module(module)

    try:
        obj = getattr(mod, name)
    except AttributeError:
        raise NameError(f"Module '{module}' doesn't define any object named '{name}'")

    return obj

def without_none_values(iterable):
    
    try:
        return {k: v for k, v in iterable.items() if v is not None}
    except AttributeError:
        return type(iterable)((v for v in iterable if v is not None))    

SETTINGS_PRIORITIES = {
    'default': 0,
    'project': 20,
    'cmdline': 40,
}


def get_settings_priority(priority):

    if isinstance(priority, str):
        return SETTINGS_PRIORITIES[priority]
    else:
        return priority


class SettingsAttribute:

    def __init__(self, value, priority):
        self.value = value
        if isinstance(self.value, Settings):
            self.priority = max(self.value.maxpriority(), priority)
        else:
            self.priority = priority

    def set(self, value, priority):
        if priority >= self.priority:
            if isinstance(self.value, Settings):
                value = Settings(value, priority=priority)
            self.value = value
            self.priority = priority

    def __str__(self):
        return f"<SettingsAttribute value={self.value!r} priority={self.priority}>"

    #__repr__ = __str__

class Settings(MutableMapping):

    def __init__(self, values=None, priority='project'):
        self.frozen = False
        self.attributes = {}
        if values:
            self.update(values, priority)

    def __getitem__(self, opt_name):
        if opt_name not in self:
            return None
        return self.attributes[opt_name].value

    def __contains__(self, name):
        return name in self.attributes

    def get(self, name, default=None):

        return self[name] if self[name] is not None else default

    def getbool(self, name, default=False):

        got = self.get(name, default)
        try:
            return bool(int(got))
        except ValueError:
            if got in ("True", "true"):
                return True
            if got in ("False", "false"):
                return False
            raise ValueError("Supported values for boolean settings are 0/1, True/False, '0'/'1', 'True'/'False' and 'true'/'false'")

    def getint(self, name, default=0):

        return int(self.get(name, default))

    def getfloat(self, name, default=0.0):

        return float(self.get(name, default))

    def getlist(self, name, default=None):

        value = self.get(name, default or [])
        if isinstance(value, str):
            value = value.split(',')
        return list(value)

    def getdict(self, name, default=None):

        value = self.get(name, default or {})
        if isinstance(value, str):
            value = json.loads(value)
        return dict(value)

    def getpriority(self, name):

        if name not in self:
            return None
        return self.attributes[name].priority

    def maxpriority(self):

        if len(self) > 0:
            return max(self.getpriority(name) for name in self)
        else:
            return get_settings_priority('default')

    def __setitem__(self, name, value):
        self.set(name, value)

    def set(self, name, value, priority='project'):

        self._assert_mutability()
        priority = get_settings_priority(priority)
        if name not in self:
            if isinstance(value, SettingsAttribute):
                self.attributes[name] = value
            else:
                self.attributes[name] = SettingsAttribute(value, priority)
        else:
            self.attributes[name].set(value, priority)

    def setdict(self, values, priority='project'):
        self.update(values, priority)

    def setmodule(self, module, priority='project'):

        self._assert_mutability()
        if isinstance(module, str):
            module = import_module(module)
        for key in dir(module):
            if key.isupper():
                self.set(key, getattr(module, key), priority)

    def update(self, values, priority='project'):

        self._assert_mutability()
        if isinstance(values, str):
            values = json.loads(values)
        if values is not None:
            if isinstance(values, Settings):
                for name, value in values.items():
                    self.set(name, value, values.getpriority(name))
            else:
                for name, value in values.items():
                    self.set(name, value, priority)

    def delete(self, name, priority='project'):
        self._assert_mutability()
        priority = get_settings_priority(priority)
        if priority >= self.getpriority(name):
            del self.attributes[name]

    def __delitem__(self, name):
        self._assert_mutability()
        del self.attributes[name]

    def _assert_mutability(self):
        if self.frozen:
            raise TypeError("Trying to modify an immutable Settings object")

    def copy(self):

        return copy.deepcopy(self)

    def freeze(self):

        self.frozen = True

    def frozencopy(self):

        copy = self.copy()
        copy.freeze()
        return copy

    def __iter__(self):
        return iter(self.attributes)

    def __len__(self):
        return len(self.attributes)

    def _to_dict(self):
        return {self._get_key(k): (v._to_dict() if isinstance(v, Settings) else v)
                for k, v in self.items()}

    def _get_key(self, key_value):
        return (key_value if isinstance(key_value, (bool, float, int, str, type(None)))
                else str(key_value))

    def copy_to_dict(self):
        
        settings = self.copy()
        return settings._to_dict()
    
def build_component_list(compdict, custom=None):

    def _check_components(complist):
        if len({c for c in complist}) != len(complist):
            raise ValueError(f'Some paths in {complist!r} convert to the same object, please update your settings')

    def _map_keys(compdict):

        _check_components(compdict)
        return {k: v for k, v in compdict.items()}

    def _validate_values(compdict):
        for name, value in compdict.items():
            if value is not None and not isinstance(value, numbers.Real):
                raise ValueError(f'Invalid value {value} for component {name}, please provide a real number or None instead')

    _validate_values(compdict)
    compdict = without_none_values(_map_keys(compdict))
    return [k for k, v in sorted(compdict.items(), key=itemgetter(1))]