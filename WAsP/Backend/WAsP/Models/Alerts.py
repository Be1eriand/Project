from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, DateTime, String)

from .models import Base

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