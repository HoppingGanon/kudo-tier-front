powershell.exe -ExecutionPolicy RemoteSigned %~dp0vue-to-json.ps1
powershell.exe -ExecutionPolicy RemoteSigned %~dp0json-to-noml.ps1
nomnoml json-diagram\src\assets\components-list.noml json-diagram\src\assets\components-list.svg

pause
