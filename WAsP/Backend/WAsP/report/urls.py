from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="Report-Home"),
    path('1', views.report1, name="Report-1"),
    path('1/<int:job>', views.report1, name="Report-1"),
    path('2', views.report2, name="Report-2"),
    path('2/<int:employee>/<slug:fromDate>/<slug:toDate>', views.report2, name="Report-2"),
    path('3', views.report3, name="Report-3"),
    path('3/<int:machine>/<slug:fromDate>/<slug:toDate>', views.report3, name="Report-3"),
]