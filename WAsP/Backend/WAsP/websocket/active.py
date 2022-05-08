from pprint import pprint
import threading
from channels.generic.websocket import JsonWebsocketConsumer
import datetime

from django.conf import settings
from sqlalchemy import select, and_, text

from data.serializers import ActiveViewSerializer, WPSViewSerializer, RealTimeSerializer
from Models.Views import ActiveView, RealTimeDataView, SpecTaskView

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


class ActiveConsumer(JsonWebsocketConsumer):

    schedulerActive = False
    count = 0

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
    
    #@database_sync_to_async
    def get_active_machines(self):

        #selected = session.query(ActiveView).all()
        #serialised = ActiveViewSerializer(selected, many=True)

        #return serialised.data

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

    @setInterval(5.0)
    def send_updates(self):

        data = self.get_active_machines()

        #if len(data) != self.count:
        #    self.count = len(data)
        self.send_json(data)