import datetime
from sqlalchemy import text, select
from sqlalchemy.orm import session
from sqlalchemy.exc import IntegrityError
from kaitaistruct import KaitaiStream, BytesIO
import kaitaistruct
import socket
import threading
from sys import path
import os
from pathlib import Path

#get the current working directory to allow the get the models
current_path = os.path.dirname(Path.cwd())+'\WAsP'
path.append(current_path)

from Models.models import Assignment, RealTimeData, WeldTable, WeldingTable
from sqlserver import SqlConnection
from SensorData import SensorData

HOST = '127.0.0.1'
PORT = 8888
SENSORDATASIZE = 47


class Client:
    def __init__(self, host, port, callbackfn):

        self.sqlconnection = SqlConnection('local', 'SmartFab')
        self.session = self.sqlconnection.session

        self.callbackfn = callbackfn
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, port))

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

        while True:
            try:
                raw = raw + self.sock.recv(1024)

                while (len(raw) >= SENSORDATASIZE):
                    
                    data = self.callbackfn(raw)

                    #to_sql(data, prev_time, self.session)

                    prev_time = convert_to_dateTime(data) #converts the date & time in the data object to a datetime object

                    raw = raw[SENSORDATASIZE::]

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

    assignment = Assignment()
    weldTable = WeldTable()
    weldingTable = WeldingTable()
    realTime = RealTimeData()

    #RealTime Details
    realTime.Current = data.rtdata.current/1000
    realTime.Voltage = data.rtdata.voltage/1000
    realTime.Temperature = data.rtdata.temperature/1000
    realTime.GasUsed = data.rtdata.gasused/1000
    realTime.WireFeedrate = data.rtdata.wirefeedrate/1000
    realTime.Length = data.rtdata.length/1000
    realTime.Time = convert_to_dateTime(data)
    realTime.Power = (data.rtdata.current * data.rtdata.voltage)
    realTime.Timedelta = (prevtime.timestamp() - realTime.Time.timestamp())
    if realTime.Timedelta < 0.001: #resolution for big times
        realTime.TravelSpeed = 0
        realTime.HeatInput = 0
    else:
        realTime.TravelSpeed = data.rtdata.length / realTime.Timedelta
        realTime.HeatInput = ((data.rtdata.current * data.rtdata.voltage) * 60)/(1000 * realTime.TravelSpeed)
    

    try:
        queryText = f'JobID={data.jobid}'
        records = session.query(type(assignment)).filter(text(queryText)).all()

        if len(records) == 0:
                #Assignment Details
                assignment.Welder_id = data.welderid
                assignment.Machine_id = data.machineid
                assignment.JobID = data.jobid

                session.add(assignment)
                session.commit()
                
                print("Added assignment into db")

        elif len(records) != 1:  #Should never return more than one result
            raise ValueError('Query of {classType} has more than one'.format(classType=type(object))) #Is this the best way?

        else:
            assignment = records[0]
            print("Got Assignment details")

        session.add(realTime)
        session.commit()

        queryText = f'RunNo=1 and Assignment_id={assignment.id}'
        records = session.query(type(weldTable)).filter(text(queryText)).all()

        if len(records) == 0:

                weldTable.Assignment_id = assignment.id
                weldTable.RunNo = data.runid

                session.add(weldTable)
                session.commit()
                
                print("Added WeldTable into db")
        elif len(records) != 1:  #Should never return more than one result
            raise ValueError('Query of {classType} has more than one'.format(classType=type(object))) #Is this the best way?
        else:
            weldTable = records[0]
            print("Got Weld Table details")

        #create the welding table details

        weldingTable.RT_id = realTime.id
        weldingTable.WT_id = weldTable.id
        weldingTable.Machine_id = assignment.Machine_id
        weldingTable.Welder_id = assignment.Welder_id

        session.add(weldingTable)

        session.commit()

    except IntegrityError as ex:
        print("Integrity error")
        print(ex)


def convert_to_dateTime(data: SensorData):

    date = datetime.date(data.date.year,data.date.month, data.date.day)
    seconds = int(data.time.second/1000)
    milliseconds = data.time.second - seconds * 1000
    time = datetime.time(data.time.hour, data.time.minute, seconds, milliseconds)
    return datetime.datetime.combine(date, time)

client = Client(HOST, PORT, process_sensor_data)


