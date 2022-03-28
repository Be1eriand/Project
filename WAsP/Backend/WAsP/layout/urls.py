from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="Home"),
    path('settings', views.settings, name="settings"),
]