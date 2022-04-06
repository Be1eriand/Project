from django.contrib import auth
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from dashboard.models import User_List
# Create your views here.

class WAsPTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['name'] = user.name
        # ...

        return token

class WAsPTokenObtainPairView(TokenObtainPairView):
    serializer_class = WAsPTokenObtainPairSerializer






"""
@login_required
def register(response):
    if response.method == "POST":
        form = UserCreationForm(response.POST)
        if form.is_valid():
            form.save()

        return redirect("/")
    else:
        form = UserCreationForm()
    
    return render(response, "register/index.html", {"form": form})


@login_required
def changePassword(request):

    return render(request, "change-password.html")
"""
