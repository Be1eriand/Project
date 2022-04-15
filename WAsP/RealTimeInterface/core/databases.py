import pprint
from collections import defaultdict, deque
from typing import Callable, Deque, Dict, Optional #, cast, Iterable
from core.utils import load_object, create_instance, build_component_list, Settings
from core.exceptions import NotConfigured

class DatabaseManager:

    def __init__(self, *databases):
        self.databases = databases

        self.properties: Dict[str, Deque[Optional[Callable]]] = defaultdict(deque)

        for db in databases:
            self._add_databases(db)

    @classmethod
    def _get_dblist_from_settings(cls, settings):
        return settings.getdict('DATABASE')
        
    @classmethod
    def from_settings(cls, settings: Settings):
        dblist = cls._get_dblist_from_settings(settings)
        databases = []
        enabled = []
        for _db in dblist:
            try:
                dbcls = load_object(_db)
                db = create_instance(dbcls, settings, dblist[_db])
                databases.append(db)
                enabled.append(_db)
            except NotConfigured as e:
                if e.args:
                    clsname = _db.split('.')[-1]
                    pprint.pformat(clsname)

        return cls(*databases)

    def _add_databases(self, db): 
        if hasattr(db, 'session'):
            self.properties['session'].append(db.session)

        if hasattr(db, 'connection'):
            self.properties['connection'].append(db.connection)