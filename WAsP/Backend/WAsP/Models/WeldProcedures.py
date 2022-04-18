from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, String, Float)

from .models import Base

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