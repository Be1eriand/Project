import urllib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text, select
import csv

from models import Base, WPS, WPS_Run, Specification

params = urllib.parse.quote('DRIVER={SQL Server Native Client 11.0};SERVER=(local);DATABASE=SmartFab;Trusted_Connection=yes;')
engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
        
connection = engine.connect()

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession(bind=connection)

file = '.\\csv files\\WPS Data.csv'
count = 0

with open(file, 'r') as f:
    data = csv.DictReader(f)
    for datum in data:
        try:

            qText = f'WPS_No={datum["WPSNo"]}'
            result = session.query(WPS).filter(text(qText)).one_or_none()

            if  result is not None: #is this even correct? I dont think so
                j = result

            run = WPS_Run(
                Run_No=datum["Runid"]
            )

            run.specifications = Specification(
                Side=datum["Side"],
                Position=datum["Position"],
                Class=datum["Class"],
                Size=datum["Size"],
                Gas_Flux_Type=datum["Gas Flux Type"],
                Polarity=datum["Polarity"],
                Current_Min=datum["Current_min"],
                Current_Max=datum["Current_max"],
                Voltage_Min=datum["Voltage_min"],
                Voltage_Max=datum["Voltage_max"],
                Travel_Speed_Min=datum["TravelSpeed_min"],
                Travel_Speed_Max=datum["TravelSpeed_max"],
                Heat_Input_Min=datum["HeatInput_min"],
                Heat_Input_Max=datum["HeatInput_max"],
            )

            run.wps = WPS( 
                WPS_No=datum["WPSNo"],
                Welding_Code=datum["WeldingCode"],
                Joint_type=datum["JointType"]
            )

            session.add(run)
            session.commit()
            
            count += 1

        except Exception as e:
            print(e)
            session.rollback()

    print(f"{count} records added.")
    count = 0