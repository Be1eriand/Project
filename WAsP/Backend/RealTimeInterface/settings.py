#Settings for the Real Time Interface

MIDDLEWARES = {
    #Sensor Input Side
    'pipelines.realtime.RealTimePipe': 100, #Must always be first
    'pipelines.display.DisplayDataPipe': 150, #Must always be second
    'pipelines.buffer.DataBufferPipe': 200, #Must always be third
    'pipelines.process.ProcessDataPipe': 250,#Must always be fourth
    'pipelines.beat.BeatPipe': 300,#Must always be fifth
    'pipelines.sql.SqlWriterPipe': 950, #Must be 2nd Last
    'pipelines.alerts.AlertsPipe': 1000, #Must be last
    #SQL Server Side
}

#Packet Size of the sensor data being sent to the RTI
SENSORDATASIZE = 47

#Sensor Server configuration
SENSOR = {
    'HOST': '127.0.0.1',
    'PORT': 8888,
}


#SQL Database configuration settings
DATABASE = {
    'core.sqlserver.SqlConnection': {
        'DRIVER': '{SQL Server Native Client 11.0}',
        'SERVER': '(local)',
        'DATABASE': 'SmartFab',
        'Trusted_Connection': 'yes',
        }   
    }


#How long to wait before re-attempting to reconnect with the sensor server in seconds
SENSOR_RECONNECT_TIME = 5.0

#Specification Variables to Monitor to generate out of Specification
#To be defined as the columns in the RealTimeData table
ALERT_LIST = [
    'Current',
    'Voltage',
    'HeatInput',
    'TravelSpeed',
]