import datetime
from pprint import pprint
from django.db import IntegrityError, connection
from rest_framework.request import Request
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from sqlalchemy import text, select

#Serialisers
from .serializers import *

#WAsP Model imports
from Models.Realtime import *
from Models.WeldProcedures import *
from Models.Contract import *
from Models.Views import *

session = settings.SESSION
connection = settings.CONNECTION

# Create your views here.
class DataAPI(APIView): #GET, POST
    #permission_classes = (IsAuthenticated,)

    def get(self, *args):

        request: Request = args[0] 

        try:
            results = session.query(RealTimeDataView).all()
            serialised = RealTimeDataViewSerializer(results, many=True)

            return  JsonResponse(serialised.data, safe=False)

        except ValueError as e:
            return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

    def post(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)

class RealtimeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, *args):

        if len(args) > 2 :
            return Response(status.HTTP_400_BAD_REQUEST)

        if len(args) > 1:
            path: Request = args[0] #TasKID, WelderID, MachineID
            qType = path.get_full_path().split('/')[-2]
            id = args[1] #ID number

            qText = f'{qType.capitalize()}ID={id}'

            results = connection.execute(select(RealTimeDataView).where(text(qText))).fetchall()
            serialised = RealTimeDataViewSerializer(results, many=True)

        else:
            #return all active data within the last 30 secs
            last_30secs = datetime.datetime.now() - datetime.timedelta(minutes=0.5)
            print(last_30secs)
            #results = session.query(RealTimeDataView).filter(RealTimeDataView.Time > last_30secs).all() #.one_or_none() #RealTimeDataView.Time >= last_60secs
            selected = connection.execute(select(RealTimeDataView).where(RealTimeDataView.Time > last_30secs)).fetchall() # Why does this work but not the above
            serialised = RealTimeDataViewSerializer(selected, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)

class SpecificationView(APIView): #Follows CRUD
    permission_classes = (IsAuthenticated,)

    def get(self, *args):

        wps= args[1] if len(args)>=2 else None 
        run= args[2] if len(args)>=3 else None

        qText = ''

        if wps is not None:
            
            qText = f'WPS_No={wps} and Run_No={run}' if run is not None else f'WPS_No={wps}' 
            
        data = session.query(WPSView).filter(text(qText)).all()
        
        serialised = WPSViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, *args):

        request: Request = args[0]
        data = request.data

        wps = WPS(
            WPS_No = data['WPS_No'],
            Welding_Code = data['Welding_Code'],
            Joint_type = data['Joint_type'],
        )

        wps_run = WPS_Run(
            Run_No = data['Run_No'],
        )

        specification = Specification(
            Side = data['Side'],
            Position = data['Position'],
            Class = data['Class'],
            Size = data['Size'],
            Gas_Flux_Type = data['Gas_Flux_Type'],
            Current_Min = data['Current_Min'],
            Current_Max = data['Current_Max'],
            Voltage_Min = data['Voltage_Min'],
            Voltage_Max = data['Voltage_Max'],
            Polarity = data['Polairty'],
            TravelSpeed_Min = data['TravelSpeed_Min'],
            TravelSpeed_Max = data['TravelSpeed_Max'],
            InterpassTemp_Min = data['InterpassTemp_Min'],
            InterpassTemp_Max = data['InterpassTemp_Max'],
            HeatInput_Min = data['HeatInput_Min'],
            HeatInput_Max = data['HeatInput_Max'],
        )

        wps_run.specifications = specification
        wps.runs = wps_run

        try:
            session.add(wps)
            session.commit()
        except IntegrityError:
            session.rollback()
            return HttpResponseBadRequest()
        except Exception as e:
            session.rollback()
            pprint(e)
            return HttpResponseBadRequest()

        return HttpResponse(status.HTTP_200_OK) #return the object?
    
    def put(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)


class ContractView(APIView):    #Follows CRUD
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(ContractTaskView).all() if len(args) == 1 else session.query(ContractTaskView).filter(text(f'id={args[1]}')).all()

        serialised = ContractTaskSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)
        

    def post(self, *args):

        request: Request = args[0]
        data = request.data

        contract: JobContract = JobContract(
            ContractID = data['ContractID'],
            ContractName = data['ContractName'],
            Details = data['Details'],
        )

        task: TaskAssignment = TaskAssignment(
            WPSNo = data['WPS_No'],
            WelderID = data['Welderid'],
            MachineID = data['Machineid'],
        )
        
        contract_association = TaskAssociation()

        contract_association.task = task

        contract.tasks.append(contract_association)

        try:
            session.add(contract)
            session.commit()
        except IntegrityError:
            session.rollback()
            return HttpResponseBadRequest()
        except Exception as e:
            session.rollback()
            pprint(e)
            return HttpResponseBadRequest()

        return HttpResponse(status.HTTP_200_OK) #return the object?
    
    def put(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)


class TaskAssignmentView(APIView):    #Follows CRUD
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(TaskView).all() if len(args) == 1 else session.query(TaskView).filter(text(f'TaskID={args[1]}')).all()

        serialised = TaskViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

    def post(self, *args):

        request: Request = args[0]
        data = request.data

        task = TaskAssignment(
            WPSNo = data['WPS_No'],
            WelderID = data['Welderid'],
            MachineID = data['Machineid'],
        )

        try:
            session.add(task)
            session.commit()
        except IntegrityError:
            session.rollback()
            return HttpResponseBadRequest()
        except Exception as e:
            session.rollback()
            pprint(e)
            return HttpResponseBadRequest()

        return HttpResponse(status.HTTP_200_OK)
    
    def put(self, *args):

        request: Request = args[0]
        data = request.data

        task = TaskAssignment(
            id = data['TaskID'],
            WPSNo = data['WPS_No'],
            WelderID = data['Welderid'],
            MachineID = data['Machineid'],
        )

        try:
            session.query(TaskAssignment).update(task)
        except IntegrityError:
            return HttpResponseBadRequest()
        except Exception as e:
            pprint(e)

        return HttpResponse(status.HTTP_200_OK)
    
    def delete(self, *args):

        request: Request = args[0]

        return Response(status.HTTP_400_BAD_REQUEST)