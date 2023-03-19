
function Get-Licenses-Go-Mod ($Path  ='', $OutputPath = 'go-mod-licenses.json') {
    # コマンドが使えるか確認
    $commandInfo = $null
    $commandInfo = Get-Command 'go-licenses'
    if ($commandInfo -eq $null) {
        Write-Host 'go-licensesコマンドへのパスが通っていません' -ForegroundColor Red
        Write-Host '処理を中断します' -ForegroundColor Red
        return
    }

    # 初期値をセット
    if ($Path -eq '') {
        $Path = (pwd).Path
    }

    $licenses = (go-licenses csv .) | ConvertFrom-Csv -Header @('Name', 'Url', 'License')
    
    # go.modの確認
    if (-not (Test-Path "${Path}\go.mod" -PathType Leaf)) {
        Write-Host "'${Path}\go.mod'が存在しません" -ForegroundColor Red
        Write-Host '処理を中断します' -ForegroundColor Red
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
            Write-Host "'$($license.File)'のライセンスを見つけられませんでした" -ForegroundColor Red
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
                Write-Host "'$($license.Name)'がgo.mod内にがありません" -ForegroundColor Red
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

    # 結果をJSON出力
    ConvertTo-Json $licanseList | Out-File $OutputPath -Encoding utf8
    Write-Host "ライセンス情報を'${OutputPath}'に保存しました" -ForegroundColor Green
    return
}
