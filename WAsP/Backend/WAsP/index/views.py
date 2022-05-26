from django.shortcuts import render
import datetime
from pprint import pprint
from django.db import IntegrityError
from rest_framework.request import Request
from django.http import HttpResponse, HttpResponseBadRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.

def AppView(request):

    return render(request,"index.html")

def page_not_found_view(request, exception):
    return HttpResponse(exception)
