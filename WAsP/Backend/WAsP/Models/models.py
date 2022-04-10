#from django.db import models
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Create your models here.

class BaseModel():

    def to_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}