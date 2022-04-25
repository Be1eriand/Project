#Contains the serializers for each of the models used in the views
from rest_framework import serializers
from Models.Contract import *


class RealTimeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    Time = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S.%f')
    Current = serializers.FloatField(read_only=True)
    Voltage = serializers.FloatField(read_only=True)
    Temperature = serializers.FloatField(read_only=True)
    Length = serializers.FloatField(read_only=True)
    WireFeedrate = serializers.FloatField(read_only=True)
    GasUsed = serializers.FloatField(read_only=True)
    HeatInput = serializers.FloatField(read_only=True) 
    TravelSpeed = serializers.FloatField(read_only=True) 
    Timedelta = serializers.FloatField(read_only=True)
    Power = serializers.FloatField(read_only=True)

class ContractSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    ContractName = serializers.CharField(max_length=100)
    Details = serializers.CharField(allow_blank=True)

class TaskSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    WPSNo = serializers.IntegerField()
    WelderID = serializers.IntegerField()
    MachineID = serializers.IntegerField()

class ContractTaskSerializer(serializers.Serializer):
    
    WPS_No = serializers.IntegerField(read_only=True)
    ContractID = serializers.IntegerField(read_only=True)
    ContractName = serializers.CharField(max_length=100, read_only=True)
    TaskID = serializers.IntegerField( read_only=True)
    FullName = serializers.CharField(max_length=51, read_only=True)
    Description = serializers.CharField(max_length=25, read_only=True)


class RealTimeDataViewSerializer(serializers.Serializer):
    
    TaskID = serializers.IntegerField()
    RunNo = serializers.IntegerField()
    WelderID = serializers.IntegerField()
    MachineID = serializers.IntegerField()
    Time = serializers.DateTimeField()
    Current = serializers.FloatField()
    Voltage = serializers.FloatField()
    Temperature = serializers.FloatField()
    Length = serializers.FloatField()
    WireFeedrate = serializers.FloatField()
    GasUsed = serializers.FloatField()
    HeatInput = serializers.FloatField()
    TravelSpeed = serializers.FloatField()
    Timedelta = serializers.FloatField() 
    Power = serializers.FloatField()

class AlertViewSerializer(serializers.Serializer):

    AlertID = serializers.IntegerField()
    Jobid = serializers.IntegerField()
    AlertType = serializers.CharField(max_length=100, read_only=True)
    SpecType = serializers.CharField(max_length=100, read_only=True)
    StartTime = serializers.DateTimeField()
    EndTime = serializers.DateTimeField()

class WPSViewSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    WPS_No = serializers.IntegerField()
    Welding_Code = serializers.CharField(max_length=100, read_only=True)
    Joint_type = serializers.CharField(max_length=100, read_only=True)
    Run_No = serializers.IntegerField()
    Side = serializers.CharField(max_length=100, read_only=True)
    Position = serializers.CharField(max_length=100, read_only=True)
    Class = serializers.CharField(max_length=100, read_only=True)
    Size = serializers.FloatField()
    Gas_Flux_Type = serializers.CharField(max_length=100, read_only=True)
    Current_Min = serializers.FloatField()
    Current_Max = serializers.FloatField()
    Voltage_Min = serializers.FloatField()
    Voltage_Max = serializers.FloatField()
    Polarity = serializers.CharField(max_length=100, read_only=True)
    Travel_Speed_Min = serializers.FloatField()
    Travel_Speed_Max = serializers.FloatField()
    Interpass_Temp_Min = serializers.FloatField()
    Interpass_Temp_Max = serializers.FloatField()
    Heat_Input_Min = serializers.FloatField()
    Heat_Input_Max = serializers.FloatField()

class TaskViewSerializer(serializers.Serializer):

    TaskID = serializers.IntegerField()
    WPS_No = serializers.IntegerField()
    FullName = serializers.CharField(max_length=51, read_only=True)
    MachineName = serializers.CharField(max_length=25, read_only=True)