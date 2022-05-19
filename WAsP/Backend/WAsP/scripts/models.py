from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Integer, String, Date, DateTime, Float, Text, Time)

Base = declarative_base()

class WPS(Base):
    __tablename__ = "WPS"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WPS_No = Column(Integer)
    Welding_Code = Column(String)
    Joint_type = Column(String)

class WPS_Run(Base):
    __tablename__ = "WPS_Run"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Run_No = Column(Integer)
    WPS_id = Column(Integer, ForeignKey("WPS.id"))
    Specification_id = Column(Integer, ForeignKey("Specification.id"))

    specifications = relationship("Specification", backref="WPS_Run")
    wps = relationship("WPS", backref="WPS_Run")

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
    Travel_Speed_Min = Column(Float)
    Travel_Speed_Max = Column(Float)
    Interpass_Temp_Min = Column(Float)
    Interpass_Temp_Max = Column(Float)
    Heat_Input_Min = Column(Float)
    Heat_Input_Max = Column(Float)