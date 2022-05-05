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
        processed_data['current'] = data.rtdata.current/1000
        processed_data['voltage'] = data.rtdata.voltage/1000
        processed_data['temperature'] = data.rtdata.temperature/1000
        processed_data['gasUsed'] = data.rtdata.gasused/1000
        processed_data['wireFeedrate'] = data.rtdata.wirefeedrate/1000
        processed_data['length'] = data.rtdata.length/1000
        processed_data['time'] = convert_to_dateTime(data)
        processed_data['power'] = processed_data['current'] *processed_data['voltage']
        processed_data['timedelta'] = (processed_data['time'].timestamp() - prevtime.timestamp())
        if processed_data['timedelta'] < 0.001: #resolution for big times
            processed_data['travelspeed'] = 0
            processed_data['heatinput'] = 0
        else:
            processed_data['travelspeed'] = data.rtdata.length / processed_data['timedelta']
            processed_data['heatinput'] = ((data.rtdata.current * data.rtdata.voltage) * 60)/(1000 * processed_data['travelspeed'])
        
        processed_data['TaskID'] = data.taskid
        processed_data['RunNo'] = data.runid
        processed_data['MachineID'] = data.machineid
        processed_data['WelderId'] = data.welderid

        dict['processed'] = processed_data

        return dict