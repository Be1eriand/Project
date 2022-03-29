@echo Creating Virtual Environment for WAsP Backend
cmd /C python -m venv venv

@echo Changing to Virtual Environment
cmd /C .\venv\Scripts\Activate.ps1

@echo Installing required python modules
cmd /C pip install -r requirements.txt