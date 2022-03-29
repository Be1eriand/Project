@echo OFF

@echo Building the pages for the Back End
cmd /C ng build

SETLOCAL

SET BackendPath="..\..\Backend\WAsP\WAsP\"

@echo Copying files to WAsP Back End
:: Copy Javascript files
copy .\dist\was-p\*.js %BackendPath%static\js\

::Copy Icon files
copy .\dist\was-p\favicon.ico %BackendPath%static\

:: Copy CSS files
copy .\dist\was-p\*.css %BackendPath%static\css\

::Copy HTML files
copy  .\dist\was-p\*.html ..\..\Backend\WAsP\layout\templates\
ENDLOCAL