@echo off
setlocal enabledelayedexpansion

echo.
echo =========================================
echo   Apply AI India - Production Start
echo =========================================
echo.

REM Set color
color 0C

REM Change to project root directory
cd /d "%~dp0"

echo [PRODUCTION] Starting production server...
echo.

REM Verify build exists
echo [1/4] Verifying production build...
if not exist "backend\dist\main.js" (
    echo ERROR: Production build not found
    echo Run dev-setup.bat first to build the application
    pause
    exit /b 1
)
echo ✓ Production build verified

REM Check environment
echo.
echo [2/4] Checking production environment...
if not exist "backend\.env" (
    echo ERROR: .env file not found
    echo Copy and configure backend\env.example to backend\.env
    pause
    exit /b 1
)

REM Find NODE_ENV in .env
findstr /C:"NODE_ENV=production" "backend\.env" >nul
if !errorlevel! neq 0 (
    echo WARNING: NODE_ENV is not set to 'production' in .env file
    echo This will run in development mode with SQLite
)
echo ✓ Environment configuration found

REM Start production server
echo.
echo [3/4] Starting production server...
cd backend
start "Apply AI India - Production Server" cmd /k "npm run start:prod"

echo.
echo [4/4] Waiting for production server...
:prod_wait_loop
timeout /t 2 /nobreak >nul
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 3).StatusCode } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 goto prod_ready
echo Checking server status...
goto prod_wait_loop

:prod_ready
echo.
echo =========================================
echo   Production Server Running!
echo =========================================
echo.
echo 🚀 API Endpoint: http://localhost:3000/api
echo 🌐 Web Application: http://localhost:3000/index.html
echo 📊 Health Check: http://localhost:3000/api/health
echo.
echo Production Features:
echo • Optimized performance
echo • Production database (if configured)
echo • Error logging
echo • Security headers
echo.

start http://localhost:3000/index.html

echo Server is running in production mode.
echo Press any key to close this window...
pause >nul
