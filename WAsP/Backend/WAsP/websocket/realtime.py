from channels.generic.websocket import AsyncJsonWebsocketConsumer

class RealTimeConsumer(AsyncJsonWebsocketConsumer):

    schedulerActive = False

    async def connect(self):
        self.connected = True

        self.MachineID = self.scope['url_route']['args'][0]

        await self.channel_layer.group_add(f"Machine_{self.MachineID}", self.channel_name)

        await self.accept()

    async def disconnect(self, event):

        await self.channel_layer.group_discard(f"Machine_{self.MachineID}", self.channel_name)
        await super().disconnect(event)

    async def receive(self, text_data=None, bytes_data=None):

        pass

    async def send_data(self, event):

        data = event['data']

        await self.send_json(data)