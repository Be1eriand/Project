from django.urls import  re_path
from rest_framework import routers 

import data.views as views

router = routers.DefaultRouter()
 
urlpatterns = [
    re_path(r'^$', views.DataAPI.as_view()), # for REST API test
    re_path(r'^realtime/$', views.RealtimeView.as_view()),
    re_path(r'^specification/$', views.SpecificationView.as_view()), ##Retrieve all specifications
    re_path(r'^specification/wps/(\d+)$', views.SpecificationView.as_view()), ## Path for Selecting individual WPS
    re_path(r'^specification/wps/(\d+)/(\d+)$', views.SpecificationView.as_view()), ## Path for selecting the run for an individual WPS
    re_path(r'^contracts/$', views.ContractView.as_view()), ##Retrieve all Contracts
    re_path(r'^contracts/(\d+)$', views.ContractView.as_view()), ##Path for Selecting individual contracts and related tasks
    re_path(r'^tasks/(\d+)$', views.TaskView.as_view()), ##Path for Selecting individual contracts and related tasks
]