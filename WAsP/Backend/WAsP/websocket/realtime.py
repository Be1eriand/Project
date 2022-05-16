import threading
from channels.generic.websocket import JsonWebsocketConsumer
import datetime

from django.conf import settings
from sqlalchemy import text, select, and_

from data.serializers import RealTimeDataViewSerializer
from Models.Views import RealTimeDataView

session = settings.SESSION
connection = settings.CONNECTION

def setInterval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop(): # executed in another thread
                while not stopped.wait(interval): # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True # stop if the program exits
            t.start()
            return stopped
        return wrapper
    return decorator

class RealTimeConsumer(JsonWebsocketConsumer):

    schedulerActive = False

    def connect(self):
        self.connected = True

        self.accept()

        if not self.schedulerActive:
            self.thread = self.send_updates()
            self.schedulerActive = True

    def disconnect(self, event):

        super().disconnect(event)

    def receive(self, text_data=None, bytes_data=None):

        pass

    def get_realtime_data(self, period: float, taskid: int, runno: int):

        secs = period if period > 0 else 30.0

        last_x_secs = datetime.datetime.now() - datetime.timedelta(seconds=secs)

        qText = f'TaskID={taskid} AND RunNo={runno}'

        #selected = session.query(RealTimeDataView).filter(and_(text(qText),RealTimeDataView.Time > last_x_secs)).all()
        # Why does the below work but not the above
        selected = connection.execute(select(RealTimeDataView).where(and_(text(qText),RealTimeDataView.Time > last_x_secs))).fetchall()
        
        serialised = RealTimeDataViewSerializer(selected, many=True)

        return serialised.data

    @setInterval(2.0)
    def send_updates(self):

        taskid = self.scope['url_route']['args'][0]
        runno = self.scope['url_route']['args'][1]

        data = self.get_realtime_data(30.0, taskid, runno)

        self.send_json(data)