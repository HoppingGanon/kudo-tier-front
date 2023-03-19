function VueDoc-GetWord ([String]$Source, [String]$StartToken, [String]$EndToken) {
    if ($StartToken.Length -eq 0) {
        $start = 0
    } else {
        $start = $Source.IndexOf($StartToken)
    }
    
    if ($start -ne -1) {
        $end = $Source.IndexOf($EndToken, $start + $StartToken.Length)
        if ($start -ne -1 -and $end -ne -1) {
            return @{Num=$end+$EndToken.Length;Str=$Source.Substring($start + $StartToken.Length, $end - $start - $StartToken.Length)}
        }
    }
    return @{Num=-1;Str=''}
}

function VueDoc-ProcessFile ([String]$Source) {
    $MainDescription = (VueDoc-GetWord $Source '<!--' '-->').Str.Trim(' ')
    $Components = (VueDoc-GetWord $Source 'components: {' '}').Str.Replace(' ', '').Replace("`n", '').Replace("`r", '').Split(',')
    if ($Components[0] -eq '') {
        $Components = @()
    }
    $PropsRaw = (VueDoc-GetWord $Source "`n  props: {" "`n  },").Str
    $EmitsRaw = (VueDoc-GetWord $Source "`n  emits: {" "`n  },").Str

    $num = 0
    $obj = @{Num=0;Str=''}
    $emits = New-Object Collections.ArrayList
    while ($obj.Num -ne -1) {
        $obj = VueDoc-GetWord $EmitsRaw.Substring($num) '' "=> true"
        
        $CommentsObj = (VueDoc-GetWord $obj.Str "/**" "*/")
        $Comments = $CommentsObj.Str.Trim(' ').Split("`n")

        $Name = ''
        if ($CommentsObj.Num -eq -1) {
            $Name = (VueDoc-GetWord $obj.Str "" ": (").Str.Replace(' ', '').Replace("'", '').Replace("`n", '')
        } else {
            $Name = (VueDoc-GetWord $obj.Str.SubString($CommentsObj.Num) "" ": (").Str.Replace(' ', '').Replace("'", '').Replace("`n", '')
        }
        
        $i = 0
        $paramsList = New-Object Collections.ArrayList
        $emitComment = ''
        $Comments | %{
            $comment = $_.Trim(' ')
            if ($comment.Length -gt 0 -and $comment[0] -eq '*') {
                $comment = $comment.Substring(1)
            }
            $comment = $comment.Trim(' ')
            if ($comment.Length -gt 6 -and $comment.SubString(0,7) -eq '@param ') {
                $commentParamDiv = $comment.SubString(7).IndexOf(' ')
                if ($commentParamDiv -ne -1) {
                    $paramsList.Add((New-Object PSCustomObject -Property @{
                        Name=$comment.SubString(7).SubString(0, $commentParamDiv).Replace("`r", '')
                        Comment=$comment.SubString(7).SubString($commentParamDiv).Replace("`r", '').Trim(' ')
                    })) | Out-Null
                }
            } else {
                $emitComment += $comment
            }
            $i++
        }

        if ($CommentObj.Num -eq -1) {
            $NameBlock = $obj.Str
        } else {
            $NameBlock = $obj.Str.SubString($CommentObj.Num)
        }
        
        if ($Name -ne '') {
            $emits.Add((New-Object PSCustomObject -Property @{
                name = $Name.Replace("`r", '')
                comment = $emitComment.Replace("`r", '')
                params = $paramsList
            })) | Out-Null
        }

        $num += $obj.Num
    }

    $num = 0
    $obj = @{Num=0;Str=''}
    $props = New-Object Collections.ArrayList
    while ($obj.Num -ne -1) {
        $obj = VueDoc-GetWord $PropsRaw.Substring($num) " " "`n    },"
        
        $CommentObj = (VueDoc-GetWord $obj.Str "/**" "*/")
        $Comment = $CommentObj.Str.Trim(' ')

        if ($CommentObj.Num -eq -1) {
            $NameBlock = $obj.Str
        } else {
            $NameBlock = $obj.Str.SubString($CommentObj.Num)
        }
        
        $Name =     (VueDoc-GetWord $NameBlock "    " ": {").Str.Trim(' ')
        $Type =     (VueDoc-GetWord $obj.Str "type:" "`r").Str.Trim(' ').Replace(',', '')
        $Default =  (VueDoc-GetWord $obj.Str "default:" "`r").Str.Trim(' ').Replace(',', '')
        $Required = (VueDoc-GetWord $obj.Str "required:" "`r").Str.Trim(' ').Replace(',', '')

        if ($Name -ne '') {
            $props.Add((New-Object PSCustomObject -Property @{
                name = $Name.Replace("`r", '')
                type = $Type.Replace("`r", '')
                default = $Default.Replace("`r", '')
                required = $Required.Replace("`r", '')
            })) | Out-Null
        }

        $num += $obj.Num
    }

    return New-Object PSCustomObject -Property @{
        description = $MainDescription.Replace("`r", '')
        components = $Components
        props = $props
        emits = $emits
    }

}

function VueDoc-ToJson ($Path = '', $OutputPath = '') {
    if ($Path -eq '') {
        $Path = (pwd).Path
    }
    if ($OutputPath -eq '') {
        $OutputPath = "$((pwd).Path)\vuedoc.json"
    }

    $ary = New-Object Collections.ArrayList
    ls $Path -Recurse | ?{$_.FullName -notmatch 'node_modules'} | ?{$_.Extension -eq  '.vue' -and ($_.FullName -match '.*\\views\\.*\.vue$' -or $_.FullName -match '.*\\components\\.*\.vue$')} | %{
        $f = VueDoc-ProcessFile (Get-Content $_.FullName -Raw -Encoding UTF8)
        $f | Add-Member 'FileName' $_.Name
        $ary.Add($f) | Out-Null
    }
    $ary | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 $OutputPath
}

