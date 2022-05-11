#Displaying the Data Processing
import datetime
from core.utils import convert_to_dateTime
from pipelines.pipe import Pipe

class DataBufferPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()
        
        self.time_list = {}
        self.time_list[0] = datetime.datetime.now()

    def process_data(self, dict):

        print("Processing Buffer")
        data = dict['data']

        if data.machineid not in self.time_list.keys():

            self.time_list[data.machineid] = datetime.datetime.now()

        if self.time_list[data.machineid].timestamp() - convert_to_dateTime(data).timestamp() > 30.0: #This should be rare
            self.time_list[data.machineid] = datetime.datetime.now() #has the connection interrupted for more than 30 secs?
        
        dict['prevtime'] = self.time_list[data.machineid]

        self.time_list[data.machineid] = convert_to_dateTime(data) #converts the date & time in the data object to a datetime object

        return dict