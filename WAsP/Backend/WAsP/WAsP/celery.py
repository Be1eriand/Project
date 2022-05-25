import os

import json
import datetime

from celery import shared_task, Celery
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WAsP.settings')

app = Celery('WAsP')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.beat_schedule = {

    'update-machines': {
        'task': 'WAsP.celery.send_active_machines',
        'schedule': 1,
    },
}

app.conf.timezone = 'Australia/Adelaide'

@shared_task
def send_active_machines():

    message = {'type': 'send_active',
               'data': json.dumps('Active') }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)('active_machines', message)

    return message