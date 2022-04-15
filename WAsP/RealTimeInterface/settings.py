#Settings for the Real Time Interface

MIDDLEWARES = {
    #Sensor Input Side
    'pipelines.realtime.RealTimePipe': 100, #Must always be first
    'pipelines.display.DisplayDataPipe': 150, #Must always be second
    'pipelines.buffer.DataBufferPipe': 200, #Must always be third
    'pipelines.alerts.AlertsPipe': 900,
    'pipelines.sql.SqlWriterPipe': 1000, #Must be Last
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