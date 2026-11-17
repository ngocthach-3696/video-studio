# usage: flow-collect.ps1 -Ids s002,s003 -Since "2026-11-07 17:00:00"
# character keys go to characters\, sNNN to images\
param([string[]]$Ids, [datetime]$Since)
$f = @(Get-ChildItem (Join-Path $env:USERPROFILE "Downloads") -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' -and $_.LastWriteTime -ge $Since } | Sort-Object LastWriteTime)
if ($f.Count -ne $Ids.Count) { "MISMATCH: $($f.Count) files vs $($Ids.Count) ids"; $f | Select-Object Name, LastWriteTime; exit 1 }
for ($i = 0; $i -lt $Ids.Count; $i++) {
  $sub = if ($Ids[$i] -match '^s\d{3}$') { "images" } elseif ($Ids[$i] -match '^t\d+$') { "thumbnail" } else { "characters" }
  Move-Item $f[$i].FullName (Join-Path $PSScriptRoot "$sub\$($Ids[$i]).jpg") -Force; "$($Ids[$i]) <- $($f[$i].Name)"
}
