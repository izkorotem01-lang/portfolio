@echo off
echo Video Compression Script
echo ========================
echo.
echo This script will compress your videos for web optimization.
echo Make sure you have FFmpeg installed and in your PATH.
echo.

REM Check if FFmpeg is available
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: FFmpeg is not installed or not in PATH.
    echo Please install FFmpeg from https://ffmpeg.org/download.html
    pause
    exit /b 1
)

echo Creating compressed videos...
echo.

REM Create output directory
if not exist "compressed" mkdir compressed

REM Compress Showreel.mp4 to 720p (target: 3-5 MB)
echo Compressing Showreel.mp4 to 720p...
ffmpeg -i "src\assets\Showreel.mp4" -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "compressed\Showreel_720p.mp4"

REM Compress Showreel_YT.mp4 to 720p (target: 3-5 MB)
echo Compressing Showreel_YT.mp4 to 720p...
ffmpeg -i "src\assets\Showreel_YT.mp4" -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "compressed\Showreel_YT_720p.mp4"

REM Create thumbnails
echo Creating thumbnails...
ffmpeg -i "src\assets\Showreel.mp4" -ss 00:00:02 -vframes 1 -vf scale=640:360 "compressed\Showreel_thumb.jpg"
ffmpeg -i "src\assets\Showreel_YT.mp4" -ss 00:00:02 -vframes 1 -vf scale=640:360 "compressed\Showreel_YT_thumb.jpg"

echo.
echo Compression complete!
echo.
echo Original files:
dir src\assets\*.mp4
echo.
echo Compressed files:
dir compressed\*.mp4
echo.
echo Thumbnails:
dir compressed\*.jpg
echo.
echo Replace your original videos with the compressed versions.
echo The compressed videos should be 3-5 MB each instead of 19-20 MB.
echo.
pause
