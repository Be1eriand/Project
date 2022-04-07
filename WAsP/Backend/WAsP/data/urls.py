from django.urls import path, include, re_path
 
from data.views import DataAPI, RealtimeView, SpecificationView
from rest_framework import routers 
 
router = routers.DefaultRouter()
 
urlpatterns = [
    re_path(r'^data/$', DataAPI.as_view()), # for REST API test
    re_path(r'^data/realtime/$', RealtimeView.as_view()),
    re_path(r'^data/specification/$', SpecificationView.as_view())
]