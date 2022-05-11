#Displaying the Data Processing
from pipelines.pipe import Pipe

class DisplayDataPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        print("Processing Display")
        data = dict['data']

        #Insert Try/Except for invalid data type
        print("-----------------------------------------------")
        print("Sensor Data Received")
        print("-----------------------------------------------")
        print(f"Machine ID: {data.machineid}")
        print(f"Welder ID: {data.welderid}")
        print(f"Task ID: {data.taskid}")
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

        return dict