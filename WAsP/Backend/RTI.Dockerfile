# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.10
#Add the gpg key to allow the MS package to be installed
#Get the list so we can add MS packages that we need
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add
RUN curl https://packages.microsoft.com/config/ubuntu/21.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y unixodbc-dev msodbcsql18

EXPOSE 8888

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements-docker.txt .
RUN python -m pip install -r requirements-docker.txt

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD python ./RealTimeInterface/RealTimeInterface.py