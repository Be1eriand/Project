from pprint import pprint
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class AlertConsumer(AsyncJsonWebsocketConsumer):

    schedulerActive = False

    async def connect(self):
        self.connected = True
        self.TaskID = self.scope['url_route']['args'][0]
        self.RunNo = self.scope['url_route']['args'][1]

        await self.channel_layer.group_add("alerts", self.channel_name)

        await self.accept()

    async def disconnect(self, event):

        await self.channel_layer.group_discard("alerts", self.channel_name)
        super().disconnect(event)

    async def receive(self, text_data=None, bytes_data=None):

        pass

    async def send_alerts(self, event):

        text = event['data']

        pprint(text)