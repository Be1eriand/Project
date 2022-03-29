#from django.db import models
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Integer, String, Date, DateTime, Float, Text, Time)

Base = declarative_base()

# Create your models here.

class BaseModel():

    def to_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}