from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path(
        'change-password/',
        auth_views.PasswordChangeView.as_view(
            template_name='change-password.html',
            success_url = '/'
        ),
        name='change_password'
    ),
]
