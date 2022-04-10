from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, String, Text )

from .models import Base, BaseModel

class JobContract(Base, BaseModel):
    __tablename__ = "JobContract"

    id = Column(Integer, primary_key=True)
    ContractName = Column(String)
    Details = Column(Text)

    tasks = relationship("TaskAssignment", secondary="TaskAssociation")

class TaskAssociation(Base, BaseModel):
    __tablename__ = "TaskAssociation"

    Jobid = Column(Integer, ForeignKey('JobContract.id'), primary_key=True)
    Taskid = Column(Integer, ForeignKey('TaskAssignment.id'), primary_key=True)

class TaskAssignment(Base, BaseModel):
    __tablename__ = "TaskAssignment"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    WPS_No = Column(Integer, ForeignKey('WPS.id'))
    WelderID = Column(Integer, ForeignKey('Employee.payroll_id'))
    MachineID = Column(Integer, ForeignKey('Machines.id'))

    job = relationship("JobContract", secondary="TaskAssociation")
