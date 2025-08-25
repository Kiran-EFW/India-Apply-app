@echo off
echo.
echo =====================================
echo   Apply AI India - Quick Start
echo =====================================
echo.

REM Check if in correct directory
if not exist "backend\package.json" (
    echo ERROR: Please run this script from the project root directory
    pause
    exit /b 1
)

echo Choose your startup mode:
echo.
echo [1] Development Mode (Recommended)
echo     • Hot reload enabled
echo     • Clean build process
echo     • Detailed logging
echo.
echo [2] Production Mode
echo     • Optimized performance
echo     • Production build
echo     • Error logging only
echo.
echo [3] Simple Start (Fastest)
echo     • Quick reliable startup
echo     • Automatic error prevention
echo.
echo [0] Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting in Development Mode...
    call dev-setup.bat
) else if "%choice%"=="2" (
    echo Starting in Production Mode...
    call start-production.bat
) else if "%choice%"=="3" (
    echo Starting with simple reliable setup...
    call start-simple.bat
) else if "%choice%"=="0" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    pause
    goto :eof
)
