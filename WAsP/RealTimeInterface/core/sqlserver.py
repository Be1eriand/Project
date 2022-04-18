import urllib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.models import *

class SqlConnection:

    def __init__(self, settings) -> None:
        self._server = settings['SERVER']
        self._db  = settings['DATABASE']
        self.driver = settings['DRIVER']
        self.trust_connect = settings['Trusted_Connection']

        self._params = urllib.parse.quote(f'DRIVER={settings["DRIVER"]};SERVER={settings["SERVER"]};DATABASE={settings["DATABASE"]};Trusted_Connection=yes;')
        self._engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % self._params)
        
        self._connection = self._engine.connect()

        Base.metadata.bind = self._engine

        self._DBSession = sessionmaker(bind=self._engine)
        self._session = self._DBSession(bind=self._connection)

    @property
    def session(self):
        return self._session
    
    @property
    def connection(self):
        return self._connection
