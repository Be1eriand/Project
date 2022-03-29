from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, DateTime, String)

from .models import Base, BaseModel

class AlertsTable(Base, BaseModel):
    __tablename__="AlertsTable"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    Jobid = Column(Integer)
    AlertType = Column(Integer, ForeignKey("AlertTypes.id"))
    SpecType = Column(Integer, ForeignKey("SpecType.id"))
    StartTime = Column(DateTime)
    EndTime = Column(DateTime)

    alerttype = relationship("AlertTypes", backref="AlertsTable")
    spectype = relationship("SpecTypes", backref="AlertsTable")

class AlertTypes(Base, BaseModel):
    __tablename__="AlertsType"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)

class SpecTypes(Base, BaseModel):
    __tablename__="SpecType"

    id=Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)