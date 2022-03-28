#from django.db import models
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Integer, String, Date, DateTime, Float, Text, Time)

Base = declarative_base()

# Create your models here.
class Assignment(Base):
    __tablename__ = "Assignment"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WelderID = Column(Integer)
    MachineID = Column(Integer)
    JobID = Column(Integer)

    def to_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class WeldTable(Base):
    __tablename__ = "WeldTable"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    RunNo = Column(Integer)
    Assignment_id = Column(Integer, ForeignKey('Assignment.id'))

    def to_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class WeldingTable(Base):
    __tablename__ = "WeldingTable"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    RT_id = Column(Integer, ForeignKey('RealTime_Data.id'))
    WT_id = Column(Integer, ForeignKey('WeldTable.id'))
    Welder_id = Column(Integer)
    Machine_id = Column(Integer)

    def to_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class RealTimeData(Base):
    __tablename__ = "RealTime_Data"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Time = Column(DateTime)
    Current = Column(Float)
    Voltage = Column(Float)
    Temperature = Column(Float)
    Length = Column(Float)
    WireFeedrate = Column(Float)
    GasUsed = Column(Float)
    HeatInput = Column(Float) #Computed value
    TravelSpeed = Column(Float) #Computed value
    Timedelta = Column(Float) #Computed value
    Power = Column(Float) #Computed value

    def to_dict(self):

        _dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        _dict['Time'] = _dict["Time"].strftime('%Y-%m-%d %H:%M:%S.%f') #definitely a hack to get Datetime2 as a string.

        return _dict