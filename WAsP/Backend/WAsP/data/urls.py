from django.urls import  re_path
from rest_framework import routers 

import data.views as views

router = routers.DefaultRouter()
 
urlpatterns = [
    
    #Real Time Specification
    re_path(r'^realtime/$', views.RealtimeView.as_view()), #Retrieves last 30 seconds of data 
    re_path(r'^realtime/task/(\d+)$', views.RealtimeView.as_view()), #retrieves historical data by Task
    re_path(r'^realtime/welder/(\d+)$', views.RealtimeView.as_view()), #retrieves historical data by Welder
    re_path(r'^realtime/machine/(\d+)$', views.RealtimeView.as_view()), #retrieves historical data by Machine

    #Specification URLs
    re_path(r'^specification/$', views.SpecificationView.as_view()), ##Retrieve all specifications
    re_path(r'^specification/(\d+)$', views.SpecificationView.as_view()), ## Path for Selecting individual WPS
    re_path(r'^specification/(\d+)/(\d+)$', views.SpecificationView.as_view()),
    re_path(r'^specification/list/$', views.SpecListView.as_view()), ## Path for selecting the run for an individual WPS
    
    #Contract URLS
    re_path(r'^contracts/$', views.ContractView.as_view()), ##Retrieve all Contracts
    re_path(r'^contracts/(\d+)$', views.ContractView.as_view()), ##Path for Selecting individual contracts and related tasks
    
    #Task URLs
    re_path(r'^tasks/$', views.TaskAssignmentView.as_view()),
    re_path(r'^tasks/(\d+)$', views.TaskAssignmentView.as_view()), ##Path for Selecting individual contracts and related tasks

    #Machine, Welder List URLs
    re_path(r'^machine/$', views.MachineView.as_view()),
    re_path(r'^welder/$', views.WelderView.as_view()),
    re_path(r'^specificationview/(\d+)$', views.TaskSpecView.as_view()),
    re_path(r'^specificationview/(\d+)/(\d+)/$', views.TaskSpecView.as_view()),

    #Testing to see if this works URLS
    re_path(r'^test/$', views.ActiveMachinesView.as_view()),
]