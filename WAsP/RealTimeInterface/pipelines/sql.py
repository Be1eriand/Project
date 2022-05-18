#Writing the data to the SQL database
from pprint import pprint
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from pipelines.pipe import Pipe
from models.models import Assignment, RealTimeData, RunTable, WeldingTable

class SqlWriterPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        print("Processing SQL")
        data = dict['processed']
        session = dict['session']    

        try:
            #create the welding table details
            weldingTable = WeldingTable(
                Machine_id = data["MachineID"],
                Welder_id = data['WelderID'],
            )

            weldingTable.realtime = RealTimeData(
                Current=data["Current"],
                Voltage=data["Voltage"],
                Temperature=data["Temperature"],
                GasUsed=data["GasUsed"],
                WireFeedrate=data["WireFeedrate"],
                Time=data["Time"],
                Timedelta=data["Timedelta"],
                Length=data["Length"],
                Power=data["Power"],
                HeatInput=data["HeatInput"],
                TravelSpeed=data["TravelSpeed"],
            )
            
            queryText = f'TaskID={data["TaskID"]} and WelderID={data["WelderID"]} and MachineID={data["MachineID"]}'
            record = session.query(Assignment).filter(text(queryText)).one_or_none()

            if (record is None):
                
                assignment = Assignment(
                    WelderID=data['WelderID'],
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