from django.urls import path
from . import views

urlpatterns = [
    # Productivity Dashboards
    path('', views.productivityDashboard, name="Productivity-Dashboard"),
    path('<int:welder>/<int:machine>/<int:job>/<fromdate>/<todate>', views.productivityDashboardFiltered, name="Historic-Filtered"),

    # Live Machine Dashboards
    path('live/', views.liveMachines, name="Live-Machines-Dashboard"),
    path('live/p/<int:period>', views.livePeriod, name="Live-Machines-Period"),

    # Job Tracking Dashboards
    path('jobstracker/', views.jobs, name="Jobs-Dashboard"),
    path('jobstracker/<int:jid>/', views.jobsHistoric, name="Job-Dashboard"),
    path('jobstracker/<int:job>/<int:filtered_type>/<sort_type>/<order>', views.jobsFiltered, name="Jobs-Filtered")
]
