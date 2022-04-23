from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import (Integer, String, Boolean, DateTime, Float )

from .models import Base

class Employees(Base):
    __tablename__ = "Employees"

    payroll_id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    employment_status = Column(Boolean)
    FullName = Column(String)

class Machines(Base):
    __tablename__ = "Machines"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)
    locid = Column(Integer, ForeignKey('Locations.id'))

    locationid = relationship("Locations", backref="Machines")

class Locations(Base):
    __tablename__ = "Locations"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Location = Column(String)

class TimesheetTaskType(Base):
    __tablename__="TimesheetTaskType"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Description = Column(String)

class Category(Base):
    __tablename__="Category"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Arctime = Column(Integer)

class JobTimeTracker(Base):
    __tablename__ = "JobTimeTracker"

    id = Column(Integer, primary_key=True, autoincrement="auto")
    Category = Column(Integer, ForeignKey('Category.id'))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    accum_hrs = Column(Float)
    total_hrs = Column(Float)

    category = relationship("Category", backref="JobTimeTracker")

class TimesheetTask(Base):
    __tablename__ = "TimesheetTask"

    task_id = Column(String, primary_key=True)
    payroll_id = Column(Integer, ForeignKey('Employees.payroll_id'))
    type_id = Column(Integer, ForeignKey('TimesheetTaskType.id'))
    job_id = Column(Integer, ForeignKey('JobTimeTracker.id'))
    machine_id = Column(Integer, ForeignKey('Machines.id'))
    datetime = Column(DateTime)

    employee = relationship("Employees", backref="TimesheetTask")
    job = relationship("JobTimeTracker", backref="TimesheetTask")
    task = relationship("TimesheetTaskType", backref="TimesheetTask")
    machine = relationship("Machines", backref="TimesheetTask")
