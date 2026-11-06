@echo off
title Tai MP3
set "OUT=%USERPROFILE%\Downloads\MP3"
if not exist "%OUT%" mkdir "%OUT%"

:loop
echo.
echo ============================================
echo   TAI MP3  - file luu o: %OUT%
echo   Dan link roi Enter. De trong + Enter = thoat
echo ============================================
set "URL="
set /p "URL=Link: "
if not defined URL goto end

yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --ffmpeg-location "%~dp0ffmpeg\bin" -o "%OUT%\%%(title)s.%%(ext)s" "%URL%"
if errorlevel 1 (echo. & echo [LOI] Khong tai duoc link nay.) else (echo. & echo [XONG] Da luu vao %OUT%)
goto loop

:end
start "" "%OUT%"
