import os
import sys
from pathlib import Path
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from pipelines.pipe import Pipe

WAsPdir = os.path.join(Path.cwd(), 'Backend', 'WAsP')
sys.path.append(WAsPdir)

os.environ['DJANGO_SETTINGS_MODULE'] =  'WAsP.settings'

class BeatPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()

    def process_data(self, dict):

        print("Processing Beat")

        data = {}
        data = dict['processed']
        copyTime = data['Time'] #This is a hack to over come the JSON-DateTime issue
        data['Time'] = data['Time'].strftime("%Y/%m/%d %H:%M:%S.%f")
        
        machine = data['MachineID']
        message = { 'type': 'send_data',
                    'data': data }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(f'Machine_{machine}', message)
        
        data['Time'] = copyTime
        
        return dict