"""SmartFabDashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from accounts import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    path('', include('layout.urls')), #probably will need to change this
    re_path(r'^auth_api/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(r'^auth_api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^auth_api/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('dashboard/', include('dashboard.urls')),
    path('report/', include('report.urls')),
    #path("register/", views.register , name="register"),
    re_path(r'^accounts/', include('accounts.urls')),
    path('', include("django.contrib.auth.urls")),
    #path('settings', include("layout.urls")),
    re_path(r'^', include('data.urls'))
]


handler404 = 'layout.views.page_not_found_view'
