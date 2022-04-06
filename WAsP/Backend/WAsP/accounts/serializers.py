
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

class WAsPTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # The default result (access/refresh tokens)
        token = super(WAsPTokenObtainPairSerializer, self).validate(attrs)

        token.update({'username': self.user.username})
        token.update({'id': self.user.id})
        token.update({'firstname': self.user.first_name})
        token.update({'lastname': self.user.last_name})
        token.update({'superuser': self.user.is_superuser})
        
        return token