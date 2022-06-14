
import kaitaistruct
import socket

class Client:
    def __init__(self, settings):

        sensor_settings = settings.getdict('SENSOR')

        self.db_manager = settings.get('Databases')

        self.session =  self.db_manager.properties['session'][0]

        self.packetsize = settings.getint('SENSORDATASIZE')

        self.pipes = settings['Pipes']
        
        self.server = (sensor_settings['HOST'], sensor_settings['PORT'])


    def start (self):
        
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect(self.server)

    def write(self, message):
        message = message.encode('utf-8')
        self.sock.send(message)

    def stop(self):
        self.sock.close()

    def receive(self):
        raw = b""

        while True:
            try:
                raw = raw + self.sock.recv(1024)

                while (len(raw) >= self.packetsize):
                    
                    data = {}
                    data['session'] = self.session
                    data['raw'] = raw

                    for method in self.pipes.methods['process_data']:
                        try:
                            data = method(data)
                        except: #Yeah I know this is bad
                            pass

                    raw = raw[self.packetsize::]

            except ConnectionAbortedError:
                break
            except ConnectionResetError:
                print('Connection was reset by the Sensor Server')
                break
            except ConnectionError:
                break
            except kaitaistruct.ValidationGreaterThanError:
                print("Error Validating the Sensor Data")
            except kaitaistruct.ValidationLessThanError:
                print("Error Validating the Sensor Data")
            except Exception as ex:
                print("Error")
                print(ex)
                break
