import datetime
from pprint import pprint
from django.db import IntegrityError
from rest_framework.request import Request
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse, QueryDict
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from sqlalchemy import text, select, and_

import logging

#Serialisers
from .serializers import *

#WAsP Model imports
from Models.Realtime import *
from Models.WeldProcedures import *
from Models.Contract import *
from Models.Views import *
from Models.Productivity import *

session = settings.SESSION
connection = settings.CONNECTION

#Logger to handle the debugging at this stage
#logger = logging.getLogger()
#logger.setLevel(logging.INFO)
#formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s', '%m-%d-%Y %H:%M:%S')
#
#file_handler = logging.FileHandler('sql.log')
#file_handler.setLevel(logging.INFO)
#file_handler.setFormatter(formatter)
#
#logger.addHandler(file_handler)

class RealtimeView(APIView): #Read Only -> Get
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
            query_params: QueryDict = args[0].query_params
            #return all active data within the last x secs
            secs = float(query_params['seconds']) if 'seconds' in query_params else 30.0
            last_x_secs = datetime.datetime.now() - datetime.timedelta(seconds=secs)

            task = query_params['task'] if 'task' in query_params else ''
            run = query_params['run'] if 'run' in query_params else ''

            qText = f''
            if task != '':
                qText = f'TaskID={task} AND RunNo={run}' if run != '' else f'TaskID={task}'

            #results = session.query(RealTimeDataView).filter(RealTimeDataView.Time > last_30secs).all() #.one_or_none() #RealTimeDataView.Time >= last_60secs
            # Why does the below work but not the above
            selected = connection.execute(select(RealTimeDataView).where(and_(text(qText),RealTimeDataView.Time > last_x_secs))).fetchall() if qText != '' else connection.execute(select(RealTimeDataView).where(RealTimeDataView.Time > last_x_secs)).fetchall()
            
            serialised = RealTimeDataViewSerializer(selected, many=True)

        return JsonResponse(serialised.data, safe=False)


class SpecificationView(APIView): #Follows CRUD
    permission_classes = (IsAuthenticated,)

    def get(self, *args):

        wps= args[1] if len(args)>=2 else None 
        run= args[2] if len(args)>=3 else None

        qText = ''

        if wps is not None:
            
            qText = f'WPS_No={wps} and Run_No={run}' if run is not None else f'WPS_No={wps}'

        #data = session.query(WPSView).filter(text(qText)).all()
        data = connection.execute(select(WPSView).where(text(qText))).fetchall() #Why does this work but not the above?

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
        data = request.data

        result = session.query(WPS, WPS_Run, Specification).join(WPS.runs).join(WPS_Run.specifications).filter(and_(WPS.WPS_No == data['WPS_No'], WPS_Run.Run_No == data['Run_No'])).one()

        try:
            session.begin_nested()
        except Exception as e:
            pprint(e)

        wps = result[0]
        wps_run = result[1]
        specification = result[2]
        wps.WPS_No = data['WPS_No']
        wps.Welding_Code = data['Welding_Code']
        wps.Joint_type = data['Joint_type']

        wps_run.Run_No = data['Run_No']

        specification.Side = data['Side']
        specification.Position = data['Position']
        specification.Class = data['Class']
        specification.Size = data['Size']
        specification.Gas_Flux_Type = data['Gas_Flux_Type']
        specification.Current_Min = data['Current_Min']
        specification.Current_Max = data['Current_Max']
        specification.Voltage_Min = data['Voltage_Min']
        specification.Voltage_Max = data['Voltage_Max']
        specification.Polarity = data['Polarity']
        specification.TravelSpeed_Min = data['TravelSpeed_Min']
        specification.TravelSpeed_Max = data['TravelSpeed_Max']
        specification.InterpassTemp_Min = data['InterpassTemp_Min']
        specification.InterpassTemp_Max = data['InterpassTemp_Max']
        specification.HeatInput_Min = data['HeatInput_Min']
        specification.HeatInput_Max = data['HeatInput_Max']

        session.add(wps)
        
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            return HttpResponseBadRequest()
        except Exception as e:
            session.rollback()
            pprint(e)
            return HttpResponseBadRequest()

        return HttpResponse(status.HTTP_200_OK)
    
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

class MachineView(APIView):    #Get Only at this point
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(MachinesView).all()

        serialised = MachinesViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

class WelderView(APIView):    #Get Only at this point
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(Employees).all()

        serialised = WelderViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

class TaskSpecView(APIView):    #Get Only at this point
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        task= args[1] if len(args)>=2 else None 
        run= args[2] if len(args)>=3 else None

        qText = ''

        if task is not None:
            
            qText = f'id={task} and Run_No={run}' if run is not None else f'TaskID={task}'

        data = session.query(SpecTaskView).filter(text(qText)).all()
        
        #data = session.query(SpecTaskView).all()

        serialised = SpecTaskViewSerializer(data, many=True)
        
        return JsonResponse(serialised.data, safe=False)

class SpecListView(APIView):    #Get Only at this point
    permission_classes = (IsAuthenticated,)

    def get(self, *args):
        
        data = session.query(WPSView).all()

        serialised = SpecViewSerializer(data, many=True)

        return JsonResponse(serialised.data, safe=False)

class ActiveMachinesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, *args):

        data = {}
        
        activeRecords = session.query(ActiveView).all()

        serialised = ActiveViewSerializer(activeRecords, many=True)


        data['active'] = serialised.data

        for active in activeRecords:
            selected = {}

            qText = f'id={active.TaskID} AND Run_No={active.RunNo}'

            #wpsRecords = session.query(SpecTaskView).filter(text(qText)).all()
            wpsRecords = connection.execute(select(SpecTaskView).where(text(qText))).fetchall()
            serialised = WPSViewSerializer(wpsRecords, many=True)
            selected['WPS'] = serialised.data

            qText = f'TaskID={active.TaskID} AND RunNo={active.RunNo}'
            last_x_secs = datetime.datetime.now() - datetime.timedelta(seconds=30.0)
            #rtRecords = session.query(RealTimeDataView).filter(and_(text(qText),RealTimeDataView.Time > 30.00)).all()
            rtRecords = connection.execute(select(RealTimeDataView).where(and_(text(qText),RealTimeDataView.Time > last_x_secs))).fetchall()
            serialised = RealTimeSerializer(rtRecords, many=True)
            selected['RT'] = serialised.data

            data[active.TaskID] = selected

        return JsonResponse(data, safe=False)
