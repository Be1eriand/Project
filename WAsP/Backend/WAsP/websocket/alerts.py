from pprint import pprint
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from django.conf import settings
from sqlalchemy import select, text

from data.serializers import AlertViewSerializer
from Models.Views import AlertView

session = settings.SESSION
connection = settings.CONNECTION

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

        data = await self.get_alerts()

        await self.send_json(data)

    @database_sync_to_async
    def get_alerts(self):

        qText = f'TaskID={self.TaskID} AND RunNo={self.RunNo}'

        selected = connection.execute(select(AlertView).where(text(qText))).fetchall()
        
        serialised = AlertViewSerializer(selected, many=True)

        return serialised.data
