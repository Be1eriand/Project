from pprint import pprint
from SensorData import SensorData
from core.utils import convert_to_dateTime
from pipelines.pipe import Pipe

class ProcessDataPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        print("Processing Conversion")
        prevtime = dict['prevtime']
        data: SensorData = dict['data']
        processed_data = {}

        #RealTime Details
        processed_data['Current'] = data.rtdata.current/1000 # Unit -> A
        processed_data['Voltage'] = data.rtdata.voltage/1000 # Unit -> V
        processed_data['Temperature'] = data.rtdata.temperature/1000 # Unit -> 
        processed_data['GasUsed'] = data.rtdata.gasused/1000 # Unit -> l/s
        processed_data['WireFeedrate'] = data.rtdata.wirefeedrate/1000 # Unit -> mm/s
        processed_data['Length'] = data.rtdata.length/1000 # Unit -> mm
        processed_data['Time'] = convert_to_dateTime(data) # Date Time
        processed_data['Power'] = processed_data['Current'] *processed_data['Voltage'] # Unit -> W J/s
        processed_data['Timedelta'] = (processed_data['Time'].timestamp() - prevtime.timestamp())
        if processed_data['Timedelta'] < 0.001: #resolution for big times
            processed_data['TravelSpeed'] = 0
            processed_data['HeatInput'] = 0
            processed_data['Timedelta'] = 0
        else:
            processed_data['TravelSpeed'] = processed_data['Length'] * 60 / processed_data['Timedelta'] # Unit ->  mm/min
            processed_data['HeatInput'] = (processed_data['Power'] * 60)/(1000 * processed_data['TravelSpeed']) # Unit -> KJ/min

        processed_data['TaskID'] = data.taskid
        processed_data['RunNo'] = data.runid
        processed_data['MachineID'] = data.machineid
        processed_data['WelderID'] = data.welderid

        dict['processed'] = processed_data

        return dict