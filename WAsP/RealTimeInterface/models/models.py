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

class WPS(Base):
    __tablename__ = "WPS"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WPS_No = Column(Integer)
    Welding_Code = Column(String)
    Joint_type = Column(String)

    runs = relationship("WPS_Run", back_populates="wps")

class WPS_Run(Base):
    __tablename__ = "WPS_Run"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Run_No = Column(Integer)
    WPS_id = Column(Integer, ForeignKey("WPS.id"))
    Specification_id = Column(Integer, ForeignKey("Specification.id"))

    specifications = relationship("Specification", backref="WPS_Run")
    wps = relationship("WPS", back_populates="runs")

class Specification(Base):
    __tablename__ = "Specification"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Side = Column(String)
    Position = Column(String)
    Class = Column(String)
    Size = Column(Float)
    Gas_Flux_Type = Column(String)
    Current_Min = Column(Float)
    Current_Max = Column(Float)
    Voltage_Min = Column(Float)
    Voltage_Max = Column(Float)
    Polarity = Column(String)
    TravelSpeed_Min = Column(Float)
    TravelSpeed_Max = Column(Float)
    InterpassTemp_Min = Column(Float)
    InterpassTemp_Max = Column(Float)
    HeatInput_Min = Column(Float)
    HeatInput_Max = Column(Float)

class AlertsTable(Base):
    __tablename__="AlertsTable"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    TaskID = Column(Integer)
    AlertType = Column(Integer, ForeignKey("AlertTypes.id"))
    SpecType = Column(Integer, ForeignKey("SpecTypes.id"))
    StartTime = Column(DateTime)
    FinishTime = Column(DateTime)

    alerttype = relationship("AlertTypes", back_populates="alert")
    spectype = relationship("SpecTypes", back_populates="alert")

class AlertTypes(Base):
    __tablename__="AlertTypes"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)

    alert = relationship("AlertsTable", back_populates="alerttype")

class SpecTypes(Base):
    __tablename__="SpecTypes"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)

    alert = relationship("AlertsTable", back_populates="spectype")

class AlertView(Base):
    __tablename__ = "AlertView"

    id=Column(Integer, primary_key=True)
    TaskID = Column(Integer)
    AlertType = Column(String)
    SpecType = Column(String)
    StartTime = Column(DateTime)
    FinishTime = Column(DateTime)

class WPSView(Base):
    __tablename__ = "SpecificationView"

    id = Column(Integer, primary_key=True)
    WPS_No = Column(Integer)
    Welding_Code = Column(String)
    Joint_type = Column(String)
    Run_No = Column(Integer)
    Side = Column(String)
    Position = Column(String)
    Class = Column(String)
    Size = Column(Float)
    Gas_Flux_Type = Column(String)
    Current_Min = Column(Float)
    Current_Max = Column(Float)
    Voltage_Min = Column(Float)
    Voltage_Max = Column(Float)
    Polarity = Column(String)
    TravelSpeed_Min = Column(Float)
    TravelSpeed_Max = Column(Float)
    InterpassTemp_Min = Column(Float)
    InterpassTemp_Max = Column(Float)
    HeatInput_Min = Column(Float)
    HeatInput_Max = Column(Float)