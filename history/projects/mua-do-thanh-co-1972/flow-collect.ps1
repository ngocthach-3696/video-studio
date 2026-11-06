# usage: flow-collect.ps1 -Ids s002,s003 -Since "2026-11-05 00:20:00"
param([string[]]$Ids, [datetime]$Since)
$dir = Join-Path $PSScriptRoot "images"
$f = Get-ChildItem (Join-Path $env:USERPROFILE "Downloads") -File -Filter *.jpg | Where-Object { $_.LastWriteTime -ge $Since } | Sort-Object LastWriteTime
if ($f.Count -ne $Ids.Count) { "MISMATCH: $($f.Count) files vs $($Ids.Count) ids"; $f | Select-Object Name, LastWriteTime; exit 1 }
for ($i = 0; $i -lt $Ids.Count; $i++) { Move-Item $f[$i].FullName "$dir\$($Ids[$i]).jpg" -Force; "$($Ids[$i]) <- $($f[$i].Name)" }
