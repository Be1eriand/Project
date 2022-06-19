# For more information, please refer to https://aka.ms/vscode-docker-python

#Build the Front End - Stage 1
FROM node:16.14 as builder

COPY ./Frontend/WAsP/package.json ./Frontend/WAsP/package-lock.json ./
##
RUN npm i --production
RUN npm i @angular/cli@13.3.0
RUN npm i --save-dev @angular-devkit/build-angular@13.3.0
RUN mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app
COPY ./Frontend/WAsP .

#Build the Front End
RUN  ./node_modules/.bin/ng build WAsP --output-hashing none --configuration production --base-href "/" --deploy-url "static/"


#Build the Django Backend - Stage 2
FROM python:3.10
#Add the gpg key to allow the MS package to be installed
#Get the list so we can add MS packages that we need
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add
RUN curl https://packages.microsoft.com/config/ubuntu/21.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y unixodbc-dev msodbcsql18

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements-docker.txt .
RUN python -m pip install -r requirements-docker.txt

WORKDIR /app
COPY ./Backend/WAsP /app

#Copy the files to the Backend
COPY --from=builder /ng-app/dist/was-p/*.js ./WAsP/static/js/

#Copy Icon files
COPY --from=builder /ng-app/dist/was-p/*.ico ./WAsP/static/

#Copy CSS files
COPY --from=builder /ng-app/dist/was-p/*.css  ./WAsP/static/css/

#Copy image files
COPY --from=builder /ng-app/dist/was-p/assets/*.png ./WAsP/static/images/
COPY --from=builder /ng-app/dist/was-p/assets/*.jpg ./WAsP/static/images/
COPY --from=builder /ng-app/dist/was-p/assets/*.gif ./WAsP/static/images/

#Copy HTML files
COPY  --from=builder /ng-app/dist/was-p/*.html ./home/templates/

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD daphne -b 0.0.0.0 -p 8000 WAsP.routing:application