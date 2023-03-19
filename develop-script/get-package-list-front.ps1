. "${PSScriptRoot}\get-licences\Get-Licences-Npm.ps1"

pushd "${PSScriptRoot}\.."
Get-Licenses-Npm -OutputPath "${PSScriptRoot}\..\src\assets\licenses-front.json"
Get-Licenses-Npm -DevDependencies -OutputPath "${PSScriptRoot}\..\src\assets\licenses-front-dev.json"
popd
