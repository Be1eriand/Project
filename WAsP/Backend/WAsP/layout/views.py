from collections import UserList
from django.shortcuts import render
from django.http import HttpResponse
from dashboard.models import *
from .forms import *
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

# Create your views here.

def home(request):
    return render(request, "home.html")


@login_required
def settings(request):

    confirmation, warning = None, None
    settings = DB_Settings.objects.all()

    if request.method == 'POST':

        if (request.POST.get('changeprod') == "1"):
            limit_check = True
            invalid_values = []
            s_value = None

            form_settings = ['cat1_productivity_target',
                            'cat2_productivity_target',
                            'cat3_productivity_target',
                            'cat4_productivity_target',
                            'cat5_productivity_target']
            for s in form_settings:
                try:
                    s_value = float(request.POST.get(s))
                    if (s_value < 0.00 or s_value > 100.00):
                        limit_check = False
                        invalid_values.append(s)
                except:
                    limit_check = False
                    invalid_values.append(s)

            if limit_check:
                for s in form_settings:
                    s_value = float(request.POST.get(s))
                    try:
                        print(s)
                        setting = DB_Settings.objects.get(name=s)
                        setting.value = s_value
                        setting.save()
                        confirmation = "Productivity targets set to new values"

                    except:
                        warning = "Invalid setting parameters"
            else:
                warning = "{} value{} out of range".format(', '.join(map(str, invalid_values)), 's are' if len(invalid_values) > 1 else ' is')
        
        elif (request.POST.get('changeuser') == "1"):
            uid = request.POST.get('userlist')
            try:
                user = get_user_model().objects.get(id=uid)
                if (str(user.username) != str(request.user)):
                    rank = user.is_superuser
                    new_rank = not rank
                    user.is_superuser = new_rank
                    user.save()

                    confirmation = "User {} changed to {}".format(
                        user.username, "Administrator" if new_rank else "User")
                else:
                    warning = "Cannot change own status, please see another Administrator"

            except:
                warning = "Invalid User"

        elif (request.POST.get('deleteuser') == "1"):
            uid = request.POST.get('deleteuserlist')
            try:
                user = get_user_model().objects.get(id=uid)
                if (str(user.username) != str(request.user)):
                    user.delete()
                    confirmation = "User {} deleted".format(user.username)
                else:
                    warning = "Cannot delete own account, please see another Administrator"
            except:
                warning = "Invalid User"

            
    return render(request, "settings.html",{
        "settings": settings,
        "confirmation": confirmation,
        "warning": warning,
        "users": get_user_model().objects.all().order_by('-last_login')
    })

def page_not_found_view(request, exception):
    return HttpResponse(exception)
