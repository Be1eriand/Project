#Real Time Data Processing
from kaitaistruct import KaitaiStream, BytesIO
import kaitaistruct

from SensorData import SensorData

class RealTimePipe():

    def __init__(self) -> None:
        pass

    def process_data(self, dict):

        dict['data'] = SensorData(KaitaiStream(BytesIO(dict['raw'])))

        return dict