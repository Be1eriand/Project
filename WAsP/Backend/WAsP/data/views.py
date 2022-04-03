from django.http import JsonResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from Models.Realtime import Assignment, RealTimeData, WeldingTable, WeldTable

session = settings.SESSION

# Create your views here.
class DataAPI(APIView): #GET, POST
    #permission_classes = (IsAuthenticated,)

    def get(self, request): 

        try:
            results = session.query(RealTimeData).all()
            return  JsonResponse(results, safe=False, json_dumps_params={"default": RealTimeData.to_dict})

        except ValueError as e:
            return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)