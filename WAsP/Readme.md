*** Project WAsP ***
*** Guide to contructing WAsP from Github ***

*** Requirements ***
Git
Python 3.10
Node.js v16.14
npm v8.5.5
Angular 13.3.0
Redis (Installation for Redis see https://redis.io/docs/getting-started/installation/install-redis-on-windows/)
SQL Server 2019 (SQL Server 2019 Developer or SQL Express Edition can be used for testing purposes)

If these software are not installed WAsP will not function or be able to run

*** Note ***
WAsP will perform the best in a Docker or Kubernetes container using a Linux Environment. SQL Server can be run in a Windows Server Environment separate to the Docker or Kubernetes container.


*** Python Packages ***
See Requirements.txt for packages to be installed

*** Angular/Node Packages required ***
material
flex-layout
pdfmake
eChart
ngx-echarts
ngx-color-picker

*** Installing from Github ***
1. Create a project directory in VS Code and add the folder to the workspace
2. Open a terminal window in the workspace folder created.
3. At the prompt, type git clone https://github.com/Be1eriand/Project.git

*** Adding Databases to the  SQL Server  ***
1. Open SQL Server Management Studio V18.0 or later
2. Right click on Databases
3. Select Attach...
4. Change to the Project\WAsP\Database directory
5. Add SmartFab.mdf
6. (Optional) Add SensorDataDB.mdf if you wish to test the real-time functionality of WAsP
7. Click OK (Check Permissions of the files if you cannot add the files)

*** Creating the Back End Environment ***
1. Open a terminal window at the WAsP Backend folder (ie ".\Project\WAsP\Backend\").
2. Type the following commands:
    python -m venv venv
    .\venv\scripts\activate.ps1 (this places the terminal into the venv environment)
    pip install -r requirements.txt
3. Change directory to .\Backend\WAsP
4. Type python manage.py migrate
5. Type python manage.py createsuperuser

*** Creating the Front End Environment ***
1. Open a terminal window at the root project workspace folder (ie where this Readme.md exists).
2. cd .\Frontend\WAsP
2. Type npm install @Angular/cli @Angular/material @Angular/flex-layout
3. Type npm install pdfmake eChart ngx-echarts ngx-color-picker
4. Type npm install

*** Building the Front End ***
1. Go to the directory '\Frontend\WAsP'
2. Type WAsPBuild.bat
3. Go to the directory '\Backend\WAsP'
4. Type python manage.py collectstatic

*** Starting WAsP ***
1. Open a terminal window at the Backend directory ie ".\Project\WAsP\Backend\"
2. Ensure that the venv environment has bee activated
    2a. Type .\venv\scripts\activate.ps1
3. Type .\WAsPStart.ps1


*** Compiling the Sensor Server program ***
Compile the test data program to test the real-time functionality
1. Start Visual Studio 2019
2. Select the solution SensorServer.sln in the SensorServer directory
3. Press ctrl + shift + B to build the solution
4. Press ctrl + F5 to run from the Studio 
5. or Run the program from the default directory
    ie .\SensorServer\bin\Release or \Debug
    SensorServer.exe