
function Get-Licenses-Npm ($Path  ='', $OutputPath = 'npm-licenses.json', [Switch]$DevDependencies = $false ) {
    # コマンドが使えるか確認
    $commandInfo = $null
    $commandInfo = Get-Command 'license-checker'
    if ($commandInfo -eq $null) {
        Write-Host 'license-checkerコマンドへのパスが通っていません' -ForegroundColor Red
        Write-Host '処理を中断します' -ForegroundColor Red
        return
    }

    # 初期値をセット
    if ($Path -eq '') {
        $Path = (pwd).Path
    }

    # package.jsonの確認
    if (-not (Test-Path "${Path}\package.json" -PathType Leaf)) {
        Write-Host "'${Path}\package.json'が存在しません" -ForegroundColor Red
        Write-Host '処理を中断します' -ForegroundColor Red
        return
    }

    # license-checkerでCSV取得
    pushd $Path
    $licenses = license-checker --csv | ConvertFrom-Csv
    popd

    # package.jsonの内容を取得
    $packagePath = Get-Content -Path "${Path}\package.json" -Raw
    $packageJson = ConvertFrom-Json $packagePath

    # ライセンス情報のリストを生成
    $licList = New-Object Collections.ArrayList

    # package.jsonのうち、dependenciesをループする
    $target = @()
    if ($DevDependencies) {
        $target = $packageJson.devDependencies
    } else {
        $target = $packageJson.dependencies
    }

    $target.psobject.properties.name | %{
        # パッケージ名
        $package = $_
        # バージョン
        $needed = $target.$package

        # ライセンスファイルを取得する(.mdや.txtにも対応できるように、matchで検索する)
        $flist = (ls "${Path}\node_modules\$($package)\" | ?{ $_ -match 'LICENSE' -and -not $_.PSIsContainer })

        # ライセンス内容
        $licenseContent = ''
        # ファイル名
        $fname = ''

        $exists = $flist.Length -ne 0
        if ($exists) {
            # LICENSEファイルから情報を取得
            $file = $flist[0]
            $fname = $file.Name
            $licenseContent = (Get-Content -Path $file.FullName -Raw -Encoding UTF8)
        } else {
            Write-Host "'${package}'のライセンスを見つけられませんでした" -ForegroundColor Red
        }

        $e2 = $false
        $license = $null
        $i = 0
        $licenses."module name" | %{
            # バージョンの部分を取り除いて、パッケージ名だけを検索

            if ($_ -match ("^${package}@.*")) {
                # license-checkerからの情報を取得
                $e2 = $true
                $license = $licenses[$i]
            }
            $i++
        }
    
        if ($e2) {
            # license-chekerの結果に含まれている場合は出力対象としてデータを作成
            $lic = New-Object PSCustomObject -Property @{
                fullName=$license.'module name'
                name=$package
                needed=$needed
                licenseName=$fname
                license=$license.license
                content="$licenseContent".Replace("`r`n", "`n")
            }
            $licList.Add($lic) | Out-Null
        } else {
            Write-Host "'${package}'のライセンス情報をlicense-checkerから得られませんでした" -ForegroundColor Red
        }
    }

    # 結果をJSON出力
    ConvertTo-Json $licList | Out-File $OutputPath -Encoding utf8
    Write-Host "ライセンス情報を'${OutputPath}'に保存しました" -ForegroundColor Green
    return 
}
