. "${PSScriptRoot}\get-licences\Get-Licences-Npm.ps1"

pushd "${PSScriptRoot}\json-diagram"
Get-Licenses-Npm -OutputPath "${PSScriptRoot}\json-diagram\src\assets\licenses-diagram.json"
popd
