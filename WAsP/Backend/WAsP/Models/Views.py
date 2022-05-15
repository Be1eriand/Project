from sqlalchemy import Column
from sqlalchemy import (Integer, String, DateTime, Float )

from .models import Base

class ContractTaskView(Base):
    __tablename__ = "ContractTaskView"

    ContractID = Column(Integer, primary_key=True)
    ContractName = Column(String)
    Details = Column(String)
    TaskID = Column(Integer)
    WPS_No = Column(Integer)
    FullName = Column(String)
    Description = Column(String) #Machine Name

class RealTimeDataView(Base):
    __tablename__ = "RealTimeView"

    TaskID = Column(Integer, primary_key=True)
    RunNo = Column(Integer, primary_key=True)
    WelderID = Column(Integer)
    MachineID = Column(Integer)
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

    id=Column(Integer, primary_key=True)
    TaskID = Column(Integer)
    RunNo = Column(Integer)
    AlertType = Column(String)
    SpecType = Column(String)
    StartTime = Column(DateTime)
    EndTime = Column(DateTime)

class WPSView(Base):
    __tablename__ = "WPSView"

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

class TaskView(Base):
    __tablename__ = "TaskView"

    TaskID = Column(Integer, primary_key=True)
    WPS_No = Column(Integer)
    FullName = Column(String)
    MachineName = Column(String)

class SpecTaskView(Base):
    __tablename__ = "SpecificationView"

    id = Column(Integer, primary_key=True)
    Welderid = Column(Integer)
    Machineid = Column(Integer) 
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

class ActiveView(Base):
    __tablename__ = "ActiveView"

    TaskID = Column(Integer, primary_key=True)
    RunNo = Column(Integer)
    WelderID = Column(Integer)
    MachineID = Column(Integer)