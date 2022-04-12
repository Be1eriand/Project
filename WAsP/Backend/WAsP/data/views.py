from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from sqlalchemy import text

#Serialisers
from .serializers import *

#WAsP Model imports
from Models.Realtime import *
from Models.WeldProcedures import *
from Models.Contract import *
from Models.Views import *

session = settings.SESSION

# Create your views here.
class DataAPI(APIView): #GET, POST
    permission_classes = (IsAuthenticated,)

    def get(self, request): 

        try:
            results = session.query(RealTimeData).all()
            return  JsonResponse(results, safe=False, json_dumps_params={"default": RealTimeData.to_dict})

        except ValueError as e:
            return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class RealtimeView(APIView):
    #permission_classes = (IsAuthenticated,)

    def get(self, *args):

        if len(args) > 1 :
            return Response(status.HTTP_400_BAD_REQUEST)

        #return all active data within the last 30 secs
        results = session.query(RealTimeData).select_from(RunTable).all()

        serialised = RealTimeSerializer(results, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class SpecificationView(APIView): #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def get(self, *args):

        wps= args[1] if len(args)>=2 else None 
        run= args[2] if len(args)>=3 else None

        qText = ''

        if wps is not None:
            
            qText = f'WPS_No={wps} and Run_No={run}' if run is not None else f'WPS_No={wps}' 
            
        data = session.query(WPSView).filter(text(qText)).all()
        
        serialised = WPSViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)


class ContractView(APIView):    #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(ContractTaskView).all() if len(args) == 1 else session.query(ContractTaskView).filter(text(f'id={args[1]}')).all()

        serialised = ContractTaskSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)
        

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)


class TaskAssingmentView(APIView):    #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(TaskView).all() if len(args) == 1 else session.query(TaskView).filter(text(f'TaskID={args[1]}')).all()

        serialised = TaskViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)