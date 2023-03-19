. "${PSScriptRoot}\get-licences\Get-Licences-Go-Mod.ps1"

pushd "${PSScriptRoot}\..\..\review-maker-back\"
Get-Licenses-Go-Mod -OutputPath "${PSScriptRoot}\..\src\assets\licenses-back.json"
popd