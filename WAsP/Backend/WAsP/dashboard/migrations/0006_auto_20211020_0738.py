# Generated by Django 3.2.7 on 2021-10-19 21:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_alter_user_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='timesheet_entry',
            name='shift_end',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timesheet_entry',
            name='shift_start',
            field=models.TimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
