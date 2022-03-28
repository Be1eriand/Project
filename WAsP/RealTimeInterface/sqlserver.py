import urllib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from Models.models import *

class SqlConnection:

    def __init__(self, server, database) -> None:
        self._server = server
        self._db  = database

        self._params = urllib.parse.quote('DRIVER={SQL Server Native Client 11.0};SERVER=(local);DATABASE=SmartFab;Trusted_Connection=yes;')
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
