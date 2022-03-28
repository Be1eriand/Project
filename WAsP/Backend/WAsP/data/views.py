from pickle import LIST
from typing import List
from django.forms import JSONField
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework import viewsets
import json

from django.conf import settings
from data.models import Assignment, RealTimeData, WeldingTable, WeldTable
from data.serialisers import RealTimeserialiser

session = settings.SESSION

# Create your views here.
@api_view(['GET'])
def CalcTest(request):
    try:
        if request.method == 'GET':
            results = session.query(RealTimeData).all()
            return  JsonResponse(results, safe=False, json_dumps_params={"default": RealTimeData.to_dict})

    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)