from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, String, Text )

from .models import Base
from .Productivity import Employees, Machines

class JobContract(Base):
    __tablename__ = "JobContract"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    ContractID = Column(Integer)
    ContractName = Column(String)
    Details = Column(Text)

    tasks = relationship("TaskAssociation", back_populates="contract")

class TaskAssociation(Base):
    __tablename__ = "TaskAssociation"

    Jobid = Column(Integer, ForeignKey('JobContract.id'), primary_key=True)
    Taskid = Column(Integer, ForeignKey('TaskAssignment.id'), primary_key=True)

    task = relationship("TaskAssignment", back_populates="contracts")
    contract = relationship("JobContract", back_populates="tasks")



class TaskAssignment(Base):
    __tablename__ = "TaskAssignment"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WPSNo = Column(Integer, ForeignKey('WPS.id'))
    WelderID = Column(Integer, ForeignKey('Employees.payroll_id'))
    MachineID = Column(Integer, ForeignKey('Machines.id'))

    contracts = relationship("TaskAssociation", back_populates="task")
