
function Get-Licenses-Go-Mod ($Path  ='', $OutputPath = 'go-mod-licenses.json') {
    # �R�}���h���g���邩�m�F
    $commandInfo = $null
    $commandInfo = Get-Command 'go-licenses'
    if ($commandInfo -eq $null) {
        Write-Host 'go-licenses�R�}���h�ւ̃p�X���ʂ��Ă��܂���' -ForegroundColor Red
        Write-Host '�����𒆒f���܂�' -ForegroundColor Red
        return
    }

    # �����l���Z�b�g
    if ($Path -eq '') {
        $Path = (pwd).Path
    }

    $licenses = (go-licenses csv .) | ConvertFrom-Csv -Header @('Name', 'Url', 'License')
    
    # go.mod�̊m�F
    if (-not (Test-Path "${Path}\go.mod" -PathType Leaf)) {
        Write-Host "'${Path}\go.mod'�����݂��܂���" -ForegroundColor Red
        Write-Host '�����𒆒f���܂�' -ForegroundColor Red
        return
    }

    
    $modLines = New-Object Collections.ArrayList
    Get-Content "${Path}\go.mod" | %{
        $line = "$_".Replace("`t",'  ').Trim(' ').Split(' ')
        if ($line.Count -ge 2) {
            $modLines.Add($line) | Out-Null
        }
    }
    
    $licanseList = New-Object Collections.ArrayList
    $licenses | %{
        $license = $_

        if ($license.Url -eq 'Unknown') {
            Write-Host "'$($license.File)'�̃��C�Z���X���������܂���ł���" -ForegroundColor Red
        } else {
            $i = 0
            $exists = $false
            :lo forEach ($line in $modLines) {
                $exists = $license.Name -eq $line[0]
                if ($exists) {
                    break lo
                }
                $i++
            }

            $version = ''
            $fullName = ''
            $content = ''
            $licenseName = ''
            if ($exists) {
                $version = $modLines[$i][1]
                $fullName = "$($modLines[$i][0])@$($modLines[$i][1])"
                $files = ls "$($env:GOPATH)\pkg\mod\$($fullName)" | ?{-not $_.PSIsContainer -and $_.BaseName -match '^LICEN[SC]E$'}
                if ($files.Count -gt 0) {
                    $licenseName = $files[0].Name
                    $content = (Get-Content -Encoding utf8 -Raw $files[0].FullName).Replace("`r`n", "`n")
                }
            } else {
                Write-Host "'$($license.Name)'��go.mod���ɂ�����܂���" -ForegroundColor Red
            }

            $licanseList.Add((
                New-Object PSCustomObject -Property @{
                    fullName=$fullName
                    license=$license.License
                    name=$license.Name
                    version=$version
                    licenseName=$licenseName
                    content=$content
                }
            )) | Out-Null
        }
    }

    # ���ʂ�JSON�o��
    ConvertTo-Json $licanseList | Out-File $OutputPath -Encoding utf8
    Write-Host "���C�Z���X����'${OutputPath}'�ɕۑ����܂���" -ForegroundColor Green
    return
}
