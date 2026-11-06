# Cài đặt video-studio trên máy mới.
# Chạy:  powershell -ExecutionPolicy Bypass -File C:\video-studio\setup.ps1
# Repo phải nằm ở C:\video-studio (skill ghi đường dẫn tuyệt đối).

$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$tools = Join-Path $root 'tools'
New-Item -ItemType Directory -Force $tools | Out-Null
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if ($root -ne 'C:\video-studio') {
    Write-Warning "Repo đang ở $root, không phải C:\video-studio. Skill sẽ trỏ sai đường dẫn."
}

function Get-Zip($url, $dest) {
    $zip = Join-Path $env:TEMP ([IO.Path]::GetFileName($url))
    Write-Host "  Tải $url"
    Invoke-WebRequest $url -OutFile $zip -UseBasicParsing
    $tmp = Join-Path $env:TEMP ('vs-' + [guid]::NewGuid())
    Expand-Archive $zip $tmp
    $inner = Get-ChildItem $tmp | Select-Object -First 1
    if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
    Move-Item $inner.FullName $dest
    Remove-Item $zip, $tmp -Recurse -Force
}

# 1. Node.js 22 portable
$nodeDir = Join-Path $tools 'node'
if (-not (Test-Path (Join-Path $nodeDir 'node.exe'))) {
    Write-Host '[1/5] Cài Node.js 22 portable'
    $base = 'https://nodejs.org/dist/latest-v22.x/'
    $sums = (Invoke-WebRequest ($base + 'SHASUMS256.txt') -UseBasicParsing).Content
    $file = ([regex]'node-v[\d.]+-win-x64\.zip').Match($sums).Value
    Get-Zip ($base + $file) $nodeDir
} else { Write-Host '[1/5] Node.js đã có' }

# 2. FFmpeg portable
$ffDir = Join-Path $tools 'ffmpeg'
if (-not (Test-Path (Join-Path $ffDir 'bin\ffmpeg.exe'))) {
    Write-Host '[2/5] Cài FFmpeg'
    Get-Zip 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' $ffDir
} else { Write-Host '[2/5] FFmpeg đã có' }

# Thêm node + ffmpeg vào PATH (phiên này và User PATH)
$add = @($nodeDir, (Join-Path $ffDir 'bin'))
$env:Path = ($add -join ';') + ';' + $env:Path
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
foreach ($p in $add) {
    if (($userPath -split ';') -notcontains $p) { $userPath = "$p;$userPath" }
}
[Environment]::SetEnvironmentVariable('Path', $userPath, 'User')

# 3. npm install (shim trước vì 3 project trỏ tới nó qua file:)
Write-Host '[3/5] npm install'
foreach ($d in 'shared\edge-tts-shim', 'explainer', 'news', 'history') {
    $dir = Join-Path $root $d
    if (Test-Path (Join-Path $dir 'package.json')) {
        Write-Host "  - $d"
        Push-Location $dir
        try { npm install --no-audit --no-fund; if ($LASTEXITCODE -ne 0) { throw "npm install lỗi ở $d" } }
        finally { Pop-Location }
    }
}

# 4. Python edge-tts (dự phòng) + yt-dlp — chỉ khi có Python
Write-Host '[4/5] Python edge-tts / yt-dlp'
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) {
    $venv = Join-Path $tools 'pyedge'
    if (-not (Test-Path $venv)) { python -m venv $venv }
    & (Join-Path $venv 'Scripts\python.exe') -m pip install -q edge-tts
    python -m pip install -q --user yt-dlp
} else { Write-Warning '  Không thấy Python — bỏ qua (chỉ cần cho edge-tts dự phòng và yt-dlp).' }

# 5. File .env từ .env.example
Write-Host '[5/5] File .env'
$envs = @{ 'explainer' = '.env'; 'compare' = '.env'; 'history' = '.env'; 'news' = '.env.local' }
foreach ($d in $envs.Keys) {
    $ex  = Join-Path $root "$d\.env.example"
    $out = Join-Path $root "$d\$($envs[$d])"
    if ((Test-Path $ex) -and -not (Test-Path $out)) {
        Copy-Item $ex $out
        Write-Host "  - Tạo $d\$($envs[$d]) từ .env.example — nhớ điền key / tên kênh"
    }
}

Write-Host ''
Write-Host 'Xong. Mở terminal mới để PATH có hiệu lực.'
Write-Host 'Skill nằm trong C:\video-studio\.claude\skills — mở Claude Code ở C:\video-studio là dùng được.'
Write-Host 'Muốn dùng Google Flow: claude mcp add --scope user playwright -- npx @playwright/mcp@0.0.83 --extension'
