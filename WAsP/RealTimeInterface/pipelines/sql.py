#Writing the data to the SQL database
from pprint import pprint
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from core.utils import convert_to_dateTime
from pipelines.pipe import Pipe
from models.models import Assignment, RealTimeData, RunTable, WeldingTable

class SqlWriterPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        print("Processing SQL")
        prevtime = dict['prevtime']
        data = dict['processed']
        session = dict['session']    



        try:
            #create the welding table details
            weldingTable = WeldingTable(
                Machine_id = data["MachineID"],
                Welder_id = data['WelderId'],
            )

            weldingTable.realtime = RealTimeData(
                Current=data["current"],
                Voltage=data["voltage"],
                Temperature=data["temperature"],
                GasUsed=data["gasUsed"],
                WireFeedrate=data["wireFeedrate"],
                Time=data["time"],
                Timedelta=data["timedelta"],
                Length=data["length"],
                Power=data["power"],
                HeatInput=data["heatinput"],
                TravelSpeed=data["travelspeed"],
            )
            
            queryText = f'TaskID={data["TaskID"]} and WelderID={data["WelderId"]} and MachineID={data["MachineID"]}'
            record = session.query(Assignment).filter(text(queryText)).one_or_none()

            if (record is None):
                
                assignment = Assignment(
                    WelderID=data['WelderId'],
                    MachineID=data['MachineID'],
                    TaskID=data['TaskID']
                )

            else:
                assignment=record
                
                queryText = f'RunNo={data["RunNo"]} and Assignment_id={assignment.id}'
                record = session.query(RunTable).filter(text(queryText)).one_or_none()

            if (record is None):
                weldtable = RunTable(
                    RunNo=data["RunNo"]
                )
            else: 
                weldtable = record
            
            weldtable.assignment = assignment

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