from sqlalchemy import Column
from sqlalchemy import (Integer, String, DateTime, Float )

from .models import Base

class ContractTaskView(Base):
    __tablename__ = "ContractTaskView"

    ContractID = Column(Integer, primary_key=True)
    ContractName = Column(String)
    TaskID = Column(Integer)
    WPS_No = Column(Integer)
    FullName = Column(String)
    Description = Column(String) #Machine Name

class RealTimeDataView(Base):
    __tablename__ = "RealTimeView"

    RunNo = Column(Integer, primary_key=True)
    Welder_id = Column(Integer)
    Machine_id = Column(Integer)
    Time = Column(DateTime)
    Current = Column(Float)
    Voltage = Column(Float)
    Temperature = Column(Float)
    Length = Column(Float)
    WireFeedrate = Column(Float)
    GasUsed = Column(Float)
    HeatInput = Column(Float)
    TravelSpeed = Column(Float)
    Timedelta = Column(Float) 
    Power = Column(Float)

class AlertView(Base):
    __tablename__ = "AlertView"

    AlertID=Column(Integer, primary_key=True)
    Jobid = Column(Integer)
    AlertType = Column(String)
    SpecType = Column(String)
    StartTime = Column(DateTime)
    EndTime = Column(DateTime)

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
    Travel_Speed_Min = Column(Float)
    Travel_Speed_Max = Column(Float)
    Interpass_Temp_Min = Column(Float)
    Interpass_Temp_Max = Column(Float)
    Heat_Input_Min = Column(Float)
    Heat_Input_Max = Column(Float)

class TaskView(Base):
    __tablename__ = "TaskView"

    TaskID = Column(Integer, primary_key=True)
    WPS_No = Column(Integer)
    FullName = Column(String)
    MachineName = Column(String)
