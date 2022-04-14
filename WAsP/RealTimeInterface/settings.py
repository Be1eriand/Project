#Settings for the Real Time Interface

MIDDLEWARES = {
    #Sensor Input Side
    'RealTimeInterface.pipelines.realtime.RealTimePipe': 100, #Must always be first
    'RealTimeInterface.pipelines.display.DisplayDataPipe': 150, #Must always be second
    'RealTimeInterface.pipelines.buffer.DataBufferPipe': 200, #Must always be third
    'RealTimeInterface.pipelines.sql.SqlWriterPipe': 1000, #Must be Last
    #SQL Server Side
}

#
SENSORDATASIZE = 47

#Sensor Server
SENSOR = {
    'HOST': '127.0.0.1',
    'PORT': 8888,
}

DATABASE = {
    'DRIVER': '{SQL Server Native Client 11.0}',
    'SERVER': '(local)',
    'DATABASE': 'SmartFab',
    'Trusted_Connection': 'yes',
}