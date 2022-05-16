from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import datetime

from django.conf import settings
from sqlalchemy import select, and_, text

from data.serializers import ActiveViewSerializer, WPSViewSerializer, RealTimeSerializer
from Models.Views import ActiveView, RealTimeDataView, SpecTaskView

session = settings.SESSION
connection = settings.CONNECTION

class ActiveConsumer(AsyncJsonWebsocketConsumer):

    schedulerActive = False
    count = 0

    async def connect(self):

        self.connected = True

        await self.channel_layer.group_add("active_machines", self.channel_name)

        await self.accept()

    async def disconnect(self, event):

        await self.channel_layer.group_discard("active_machines", self.channel_name)
        super().disconnect(event)

    async def receive(self, text_data=None, bytes_data=None):

        pass
    
    @database_sync_to_async
    def get_active_machines(self):

        data = {}
        
        activeRecords = session.query(ActiveView).all()

        serialised = ActiveViewSerializer(activeRecords, many=True)


        data['active'] = serialised.data

        for active in activeRecords:
            selected = {}

            qText = f'id={active.TaskID} AND Run_No={active.RunNo}'

            #wpsRecords = session.query(SpecTaskView).filter(text(qText)).all()
            wpsRecords = connection.execute(select(SpecTaskView).where(text(qText))).fetchall()
            serialised = WPSViewSerializer(wpsRecords, many=True)
            selected['WPS'] = serialised.data

            qText = f'TaskID={active.TaskID} AND RunNo={active.RunNo}'
            last_x_secs = datetime.datetime.now() - datetime.timedelta(seconds=30.0)
            #rtRecords = session.query(RealTimeDataView).filter(and_(text(qText),RealTimeDataView.Time > 30.00)).all()
            rtRecords = connection.execute(select(RealTimeDataView).where(and_(text(qText),RealTimeDataView.Time > last_x_secs))).fetchall()
            serialised = RealTimeSerializer(rtRecords, many=True)
            selected['RT'] = serialised.data

            data[active.TaskID] = selected

        return data

    async def send_active(self, event):

        data = await self.get_active_machines()

        await self.send_json(data)