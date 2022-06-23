# For more information, please refer to https://aka.ms/vscode-docker-python
FROM dedian:latest
# ...
RUN apt-get update && apt-get install -y g++ unixodbc-dev


FROM python:3.10
RUN apt-get update && apt-get install -y python3-pip

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt
#RUN python pip install --user pyodbc

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["python", "WAsP\Backend\WAsP\manage.py"]
