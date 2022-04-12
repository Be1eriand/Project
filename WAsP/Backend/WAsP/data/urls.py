from django.urls import  re_path
from rest_framework import routers 

import data.views as views

router = routers.DefaultRouter()
 
urlpatterns = [
    re_path(r'^$', views.DataAPI.as_view()), # for REST API test
    
    #Real Time Specification
    re_path(r'^realtime/$', views.RealtimeView.as_view()),
    re_path(r'^realtime/task/(\d+)$', views.RealtimeView.as_view()),
    re_path(r'^realtime/welder/(\d+)$', views.RealtimeView.as_view()),
    re_path(r'^realtime/machine/(\d+)$', views.RealtimeView.as_view()),

    #Specification URLs
    re_path(r'^specification/$', views.SpecificationView.as_view()), ##Retrieve all specifications
    re_path(r'^specification/(\d+)$', views.SpecificationView.as_view()), ## Path for Selecting individual WPS
    re_path(r'^specification/(\d+)/(\d+)$', views.SpecificationView.as_view()), ## Path for selecting the run for an individual WPS
    
    #Contract URLS
    re_path(r'^contracts/$', views.ContractView.as_view()), ##Retrieve all Contracts
    re_path(r'^contracts/(\d+)$', views.ContractView.as_view()), ##Path for Selecting individual contracts and related tasks
    
    #Task URLs
    re_path(r'^tasks/$', views.TaskAssingmentView.as_view()),
    re_path(r'^tasks/(\d+)$', views.TaskAssingmentView.as_view()), ##Path for Selecting individual contracts and related tasks
]