from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import WAsPTokenObtainPairSerializer
# Create your views here.

class WAsPTokenObtainPairView(TokenObtainPairView):
    serializer_class = WAsPTokenObtainPairSerializer