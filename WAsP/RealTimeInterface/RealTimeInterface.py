from time import sleep

#RealTime Interface Core Modules
from core.middleware import MiddlewareManager
from core.databases import DatabaseManager
from core.utils import Settings
from core.interface import Client

def main(*args, **kwargs):

    settings = Settings()

    settings.setmodule('settings', priority='project')

    settings['Databases'] = DatabaseManager.from_settings(settings)

    settings['Pipes'] = MiddlewareManager.from_settings(settings)

    client = Client(settings)

    reconnect_time = settings.getfloat('SENSOR_RECONNECT_TIME')

    while True:
        
        try:
            client.start()
        except ConnectionRefusedError:
            print("Unable to connect to the Sensor Server to retrieve the data")

        print(f"Waiting {reconnect_time} seconds before restarting")
        sleep(reconnect_time)


if __name__ =="__main__":
    main()