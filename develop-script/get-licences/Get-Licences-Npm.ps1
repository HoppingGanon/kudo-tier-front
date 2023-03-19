
function Get-Licenses-Npm ($Path  ='', $OutputPath = 'npm-licenses.json', [Switch]$DevDependencies = $false ) {
    # �R�}���h���g���邩�m�F
    $commandInfo = $null
    $commandInfo = Get-Command 'license-checker'
    if ($commandInfo -eq $null) {
        Write-Host 'license-checker�R�}���h�ւ̃p�X���ʂ��Ă��܂���' -ForegroundColor Red
        Write-Host '�����𒆒f���܂�' -ForegroundColor Red
        return
    }

    # �����l���Z�b�g
    if ($Path -eq '') {
        $Path = (pwd).Path
    }

    # package.json�̊m�F
    if (-not (Test-Path "${Path}\package.json" -PathType Leaf)) {
        Write-Host "'${Path}\package.json'�����݂��܂���" -ForegroundColor Red
        Write-Host '�����𒆒f���܂�' -ForegroundColor Red
        return
    }

    # license-checker��CSV�擾
    pushd $Path
    $licenses = license-checker --csv | ConvertFrom-Csv
    popd

    # package.json�̓��e���擾
    $packagePath = Get-Content -Path "${Path}\package.json" -Raw
    $packageJson = ConvertFrom-Json $packagePath

    # ���C�Z���X���̃��X�g�𐶐�
    $licList = New-Object Collections.ArrayList

    # package.json�̂����Adependencies�����[�v����
    $target = @()
    if ($DevDependencies) {
        $target = $packageJson.devDependencies
    } else {
        $target = $packageJson.dependencies
    }

    $target.psobject.properties.name | %{
        # �p�b�P�[�W��
        $package = $_
        # �o�[�W����
        $needed = $target.$package

        # ���C�Z���X�t�@�C�����擾����(.md��.txt�ɂ��Ή��ł���悤�ɁAmatch�Ō�������)
        $flist = (ls "${Path}\node_modules\$($package)\" | ?{ $_ -match 'LICENSE' -and -not $_.PSIsContainer })

        # ���C�Z���X���e
        $licenseContent = ''
        # �t�@�C����
        $fname = ''

        $exists = $flist.Length -ne 0
        if ($exists) {
            # LICENSE�t�@�C����������擾
            $file = $flist[0]
            $fname = $file.Name
            $licenseContent = (Get-Content -Path $file.FullName -Raw -Encoding UTF8)
        } else {
            Write-Host "'${package}'�̃��C�Z���X���������܂���ł���" -ForegroundColor Red
        }

        $e2 = $false
        $license = $null
        $i = 0
        $licenses."module name" | %{
            # �o�[�W�����̕�������菜���āA�p�b�P�[�W������������

            if ($_ -match ("^${package}@.*")) {
                # license-checker����̏����擾
                $e2 = $true
                $license = $licenses[$i]
            }
            $i++
        }
    
        if ($e2) {
            # license-cheker�̌��ʂɊ܂܂�Ă���ꍇ�͏o�͑ΏۂƂ��ăf�[�^���쐬
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
            Write-Host "'${package}'�̃��C�Z���X����license-checker���瓾���܂���ł���" -ForegroundColor Red
        }
    }

    # ���ʂ�JSON�o��
    ConvertTo-Json $licList | Out-File $OutputPath -Encoding utf8
    Write-Host "���C�Z���X����'${OutputPath}'�ɕۑ����܂���" -ForegroundColor Green
    return 
}
