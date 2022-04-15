from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Integer, String, Date, DateTime, Float, Text, Time)

Base = declarative_base()

class Assignment(Base):
    __tablename__ = "Assignment"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WelderID = Column(Integer)
    MachineID = Column(Integer)
    TaskID = Column(Integer)

class RunTable(Base):
    __tablename__ = "RunTable"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    RunNo = Column(Integer)
    Assignment_id = Column(Integer, ForeignKey('Assignment.id'))

    assignment = relationship("Assignment", backref="RunTable")

class WeldingTable(Base):
    __tablename__ = "WeldingTable"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    RT_id = Column(Integer, ForeignKey('RealTime_Data.id'))
    WT_id = Column(Integer, ForeignKey('RunTable.id'))
    Welder_id = Column(Integer)
    Machine_id = Column(Integer)

    realtime = relationship("RealTimeData", backref="WeldingTable")
    weldtable = relationship("RunTable", backref="WeldingTable")

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