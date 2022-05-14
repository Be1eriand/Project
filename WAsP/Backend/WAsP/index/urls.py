from django.urls import path
from . import views

urlpatterns = [
    path('', views.AppView, name="App"),
]