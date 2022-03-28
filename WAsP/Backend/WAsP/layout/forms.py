from django import forms
from dashboard.models import DB_Settings

class ProductivitySettingsForm(forms.Form):

    prod_value = "{:.2f}".format(float(DB_Settings.objects.get(setting_id=1).value))

    productivity_target = forms.FloatField(
        initial=prod_value,
        localize=True,
        required=True,
        max_value=100,
        min_value=0,
        error_messages={
            "invalid": "Numbers only, do not include the % sign"
        },
        help_text="Value must be between 0.00 and 100.00",
        widget=forms.TextInput(attrs={'class': 'narrow-select'})
    )
