from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import WAsPTokenObtainPairSerializer
# Create your views here.

class WAsPTokenObtainPairView(TokenObtainPairView):
    serializer_class = WAsPTokenObtainPairSerializer
