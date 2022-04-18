import pprint
from collections import defaultdict, deque
from typing import Callable, Deque, Dict, Optional
from core.utils import load_object, create_instance, build_component_list, Settings
from core.exceptions import NotConfigured

class MiddlewareManager:

    def __init__(self, *middlewares):
        self.middlewares = middlewares

        self.methods: Dict[str, Deque[Optional[Callable]]] = defaultdict(deque)
        for mw in middlewares:
            self._add_middleware(mw)

    @classmethod
    def _get_mwlist_from_settings(cls, settings):
        return build_component_list(settings.getdict('MIDDLEWARES'))

    @classmethod
    def from_settings(cls, settings: Settings):
        mwlist = cls._get_mwlist_from_settings(settings)
        middlewares = []
        enabled = []
        for clspath in mwlist:
            try:
                mwcls = load_object(clspath)
                mw = create_instance(mwcls, settings)
                middlewares.append(mw)
                enabled.append(clspath)
            except NotConfigured as e:
                if e.args:
                    clsname = clspath.split('.')[-1]
                    pprint.pformat(clsname)

        return cls(*middlewares)

    def _add_middleware(self, mw): 
        if hasattr(mw, 'process_data'):
            self.methods['process_data'].append(mw.process_data)
