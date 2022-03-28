#Contains the serializers for each of the models used in the views
from data.models import RealTimeData
from rest_framework import serializers

class RealTimeserialiser(serializers.Serializer):
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

    class Meta:
        model = RealTimeData