import socket
import threading
from sys import path
import os
from pathlib import Path
import datetime

from sqlalchemy import text
from sqlalchemy.orm import session
from sqlalchemy.exc import IntegrityError
from kaitaistruct import KaitaiStream, BytesIO
import kaitaistruct

from middleware import MiddlewareManager
from utils import Settings, convert_to_dateTime

#get the current working directory to allow the get the models
current_path = os.path.dirname(Path.cwd())+'\WAsP'
path.append(current_path)

from Models.models import Assignment, RealTimeData, RunTable, WeldingTable
from sqlserver import SqlConnection
from SensorData import SensorData

class Client:
    def __init__(self, settings, pipes):

        sensor_settings = settings.getdict('SENSOR')
        sql_settings = settings.getdict('DATABASE')

        self.sqlconnection = SqlConnection(sql_settings)
        self.session = self.sqlconnection.session
        self.packetsize = settings.getint('SENSORDATASIZE')

        self.pipes = pipes
        
        host = sensor_settings['HOST']
        port = sensor_settings['PORT']
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, port))


    def start (self):

        receive_thread = threading.Thread(target=self.receive)
        receive_thread.start()

    def write(self, message):
        message = message.encode('utf-8')
        self.sock.send(message)

    def stop(self):
        self.sock.close()

    def receive(self):
        raw = b""
        prev_time = datetime.datetime.now()
        time_list = {}

        time_list[0] = prev_time

        while True:
            try:
                raw = raw + self.sock.recv(1024)

                while (len(raw) >= self.packetsize):
                    
                    data = {}
                    data['session'] = self.session
                    data['raw'] = raw

                    for method in self.pipes.methods['process_data']:
                        data = method(data)

                    #if data.machineid not in time_list.keys():

                    #    time_list[data.machineid] = datetime.datetime.now()

                    #if time_list[data.machineid].timestamp() - convert_to_dateTime(data).timestamp() > 30.0: #This should be rare
                    #    time_list[data.machineid] = datetime.datetime.now() #has the connection interrupted for more than 30 secs?

                    #to_sql(data, time_list[data.machineid], self.session)

                    #time_list[data.machineid] = convert_to_dateTime(data) #converts the date & time in the data object to a datetime object

                    raw = raw[self.packetsize::]

            except ConnectionAbortedError:
                break
            except kaitaistruct.ValidationGreaterThanError:
                print("Error Validating the Sensor Data")
            except kaitaistruct.ValidationLessThanError:
                print("Error Validating the Sensor Data")
            except Exception as ex:
                print("Error")
                print(ex)


def process_sensor_data(raw_data):

    data = SensorData(KaitaiStream(BytesIO(raw_data)))

    print(f"Length of raw data string {len(raw_data)}")
    print("-----------------------------------------------")
    print("Sensor Data Received")
    print("-----------------------------------------------")
    print(f"Machine ID: {data.machineid}")
    print(f"Welder ID: {data.welderid}")
    print(f"Job ID: {data.jobid}")
    print(f"RunNo: {data.runid}")
    print(f"Date : {data.date.padded_day}/{data.date.padded_month}/{data.date.padded_year}")
    print(f"Time: {data.time.padded_hour}:{data.time.padded_minute}:{data.time.second/1000}")
    print(f"Current: {data.rtdata.current/1000}A")
    print(f"Voltage: {data.rtdata.voltage/1000}V")
    print(f"Temperature: {data.rtdata.temperature/1000}C")
    print(f"Weld Length: {data.rtdata.length/1000}mm")
    print(f"Wire Feed Rate: {data.rtdata.wirefeedrate/1000}mm/min")
    print(f"Gas Used: {data.rtdata.gasused/1000}L")
    print("-----------------------------------------------")
    print("")
    print("")

    return data

def to_sql(data: SensorData, prevtime, session: session):

    #RealTime Details
    current = data.rtdata.current/1000
    voltage = data.rtdata.voltage/1000
    temperature = data.rtdata.temperature/1000
    gasUsed = data.rtdata.gasused/1000
    wireFeedrate = data.rtdata.wirefeedrate/1000
    length = data.rtdata.length/1000
    time = convert_to_dateTime(data)
    power = current *voltage
    timedelta = (time.timestamp() - prevtime.timestamp())
    if timedelta < 0.001: #resolution for big times
        travelSpeed = 0
        heatInput = 0
    else:
        travelSpeed = data.rtdata.length / timedelta
        heatInput = ((data.rtdata.current * data.rtdata.voltage) * 60)/(1000 * travelSpeed)
    

    try:
        #create the welding table details
        weldingTable = WeldingTable(
            Machine_id = data.machineid,
            Welder_id = data.welderid
        )

        weldingTable.realtime = RealTimeData(
            Current=current,
            Voltage=voltage,
            Temperature=temperature,
            GasUsed=gasUsed,
            WireFeedrate=wireFeedrate,
            Time=time,
            Timedelta=timedelta,
            Length=length,
            Power=power,
            HeatInput=heatInput
        )
        
        queryText = f'JobID={data.jobid} and WelderID={data.welderid} and MachineID={data.machineid}'
        records = session.query(Assignment).filter(text(queryText)).all()

        if (records is None) or len(records) == 0:
            
            weldtable = RunTable(
                RunNo=data.runid
            )

            weldtable.assignment = Assignment(
                WelderID=data.welderid,
                MachineID=data.machineid,
                JobID=data.jobid
            )
        else:
            assignment=records[0]

            queryText = f'RunNo={data.runid} and Assignment_id={assignment.id}'
            records = session.query(RunTable).filter(text(queryText)).all()

            weldtable = records[0]

        weldingTable.weldtable = weldtable

        session.add(weldingTable)

        session.commit()

    except IntegrityError as ex:
        print("Integrity error")
        print(ex)
        session.rollback()
    except ValueError:
        print("Database returned more than one record")
        session.rollback()


def main(*args, **kwargs):

    SETTINGS_MODULE = 'RealTimeInterface.settings'

    settings = Settings()

    settings.setmodule(SETTINGS_MODULE, priority='project')

    dataPipes = MiddlewareManager.from_settings(settings)

    client = Client(settings, dataPipes)

    client.start()

    while True:
        pass


if __name__ =="__main__":
    main()