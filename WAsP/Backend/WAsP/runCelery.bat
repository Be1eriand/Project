:: Run the Django Back-end server
@echo off
@echo Starting the server
start python manage.py runserver

@echo Starting the Celery Task Worker
start celery -A WAsP worker -P solo

@echo Starting the Celery Beat
start celery -A WAsP beat