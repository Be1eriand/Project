#Writing the data to the SQL database
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from core.utils import convert_to_dateTime
from pipelines.pipe import Pipe
from models.models import Assignment, RealTimeData, RunTable, WeldingTable

class SqlWriterPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        prevtime = dict['prevtime']
        data = dict['data']
        session = dict['session']

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
            travelspeed = 0
            heatInput = 0
        else:
            travelspeed = data.rtdata.length / timedelta
            heatInput = ((data.rtdata.current * data.rtdata.voltage) * 60)/(1000 * travelspeed)
        

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
                HeatInput=heatInput,
                TravelSpeed=travelspeed,
            )
            
            queryText = f'TaskID={data.taskid} and WelderID={data.welderid} and MachineID={data.machineid}'
            records = session.query(Assignment).filter(text(queryText)).all()

            if (records is None) or len(records) == 0:
                
                weldtable = RunTable(
                    RunNo=data.runid
                )

                weldtable.assignment = Assignment(
                    WelderID=data.welderid,
                    MachineID=data.machineid,
                    taskid=data.taskid
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
        
        return dict