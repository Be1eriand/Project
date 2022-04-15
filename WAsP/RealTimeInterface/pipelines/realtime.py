#Real Time Data Processing
from kaitaistruct import KaitaiStream, BytesIO
import kaitaistruct
from pipelines.pipe import Pipe
from SensorData import SensorData

class RealTimePipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        dict['data'] = SensorData(KaitaiStream(BytesIO(dict['raw'])))

        return dict