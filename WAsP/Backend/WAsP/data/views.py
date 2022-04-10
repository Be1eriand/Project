from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from sqlalchemy import text

#WAsP Model imports
from Models.Realtime import Assignment, RealTimeData, WeldingTable, RunTable
from Models.WeldProcedures import Specification, WPS, WPS_Run
from Models.Contract import JobContract, TaskAssociation, TaskAssignment

session = settings.SESSION

# Create your views here.
class DataAPI(APIView): #GET, POST
    permission_classes = (IsAuthenticated,)

    def get(self, request): 

        try:
            results = session.query(RealTimeData).all()
            print(request.data)
            return  JsonResponse(results, safe=False, json_dumps_params={"default": RealTimeData.to_dict})

        except ValueError as e:
            return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class RealtimeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class SpecificationView(APIView): #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def serialise(self, data):

        wps_d, run_d, spec_d = data
        
        dict = wps_d.__dict__
        dict['run'] = run_d

        dict_s = {}
        dict_s = spec_d.__dict__
        del dict_s['id']
            

        dict |= (dict_s)
        del dict['_sa_instance_state']

        return dict

    def get(self, *args):

        wps= args[1] if len(args)==2 else None 
        run= args[2] if len(args)==3 else None

        if wps is not None:
            if run is not None:
                 qText = f'WPS_No={wps} and Run_No={run}' 
            else:
                qText = f'WPS_No={wps}' 

            data = session.query(WPS, WPS_Run.Run_No, Specification).filter(text(qText)).join(WPS.runs).join(Specification).all()
            
            results = [self.serialise(d) for d in data]

        else:
            data = session.query(WPS, WPS_Run.Run_No, Specification).join(WPS.runs).join(Specification).all()

            results = [self.serialise(d) for d in data]

        return JsonResponse(results, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class ContractView(APIView):    #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def serialise(self, data):
        pass

    def get(self, *args):
        
        data = session.query(JobContract).all() if len(args) == 1 else session.query(JobContract).filter(text(f'id={args(1)}')).all()

        results = [d.__dict__ for d in data]

        return JsonResponse(results, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)

class TaskView(APIView):    #Follows CRUD
    #permission_classes = (IsAuthenticated,)

    def serialise(self, data):
        pass

    def get(self, *args):
        
        data = session.query(TaskAssignment).all() if len(args) == 1 else session.query(TaskAssignment).filter(text(f'id={args(1)}')).all()

        results = [d.__dict__ for d in data]

        return JsonResponse(results, safe=False)

    def post(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):

        return Response(status.HTTP_400_BAD_REQUEST)