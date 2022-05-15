import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..WAsP.celery import app


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

@app.task
def send_alerts(self):

    print(f'Send Alerts: {self.request!r}')

    data = {}
    
    data['test'] = 'String'

    message = {'type': 'send_alerts',
               'data': json.dumps(data) }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)('alerts', message)