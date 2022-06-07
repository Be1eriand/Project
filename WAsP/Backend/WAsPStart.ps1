Start-Process -FilePath  "python" -ArgumentList ".\RealTimeInterface\RealTimeInterface.py"

Set-Location -Path ".\WAsP"

Start-Process -FilePath  "daphne" -ArgumentList "WAsP.routing:application"