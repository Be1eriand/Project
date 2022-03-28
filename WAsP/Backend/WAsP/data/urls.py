from django.urls import path, include, re_path
 
from data import views
from rest_framework import routers
 
 
router = routers.DefaultRouter()
 
urlpatterns = [
    re_path(r'^apitest/$',views.CalcTest), # for REST API test
]