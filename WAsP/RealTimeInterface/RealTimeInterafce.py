from SensorData import SensorData
from kaitaistruct import KaitaiStream, BytesIO
import kaitaistruct
import socket
import threading

HOST = '127.0.0.1'
PORT = 8888
SENSORDATASIZE = 43


class Client:
    def __init__(self, host, port):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, port))
        
        receive_thread = threading.Thread(target=self.receive)
        receive_thread.start()

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

                while (len(raw) >= SENSORDATASIZE):
                    data = SensorData(KaitaiStream(BytesIO(raw)))

                    print(f"Length of raw data string {len(raw)}")
                    print("-----------------------------------------------")
                    print("Sensor Data Received")
                    print("-----------------------------------------------")
                    print(f"Machine ID: {data.machineid}")
                    print(f"Welder ID: {data.welderid}")
                    print(f"Job ID: {data.jobid}")
                    print(f"Date : {data.date.padded_day}/{data.date.padded_month}/{data.date.padded_year}")
                    print(f"Time: {data.time.padded_hour}:{data.time.padded_minute}:{data.time.padded_second}")
                    print(f"Current: {data.rtdata.current}A")
                    print(f"Voltage: {data.rtdata.voltage}V")
                    print(f"Temperature: {data.rtdata.temperature}C")
                    print(f"Weld Length: {data.rtdata.length}mm")
                    print(f"Wire Feed Rate: {data.rtdata.wirefeedrate}mm/min")
                    print(f"Gas Used: {data.rtdata.gasused}L")
                    print("-----------------------------------------------")
                    print("")
                    print("")

                    raw = raw[SENSORDATASIZE::]

            except ConnectionAbortedError:
                break
            except kaitaistruct.ValidationGreaterThanError:
                print("Error Validating the Sensor Data")
            except kaitaistruct.ValidationLessThanError:
                print("Error Validating the Sensor Data")
            except Exception as ex:
                print("Error")
                print(ex)

client = Client(HOST, PORT)


