from django.urls import path, include, re_path
 
from data.views import DataAPI
from rest_framework import routers 
 
router = routers.DefaultRouter()
 
urlpatterns = [
    re_path(r'^data/$', DataAPI.as_view()), # for REST API test
]