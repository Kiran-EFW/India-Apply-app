@echo off
echo.
echo =====================================
echo   Apply AI India - Reliable Start
echo =====================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is available

REM Check if in correct directory
if not exist "backend\package.json" (
    echo ERROR: Please run this script from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Create .env if needed
if not exist "backend\.env" (
    echo Creating .env file...
    copy "backend\env.example" "backend\.env" >nul
    if errorlevel 1 (
        echo ERROR: Failed to create .env file
        pause
        exit /b 1
    )
    echo .env file created
)

REM Clean old build to prevent database errors
if exist "backend\dist" (
    echo Cleaning old build...
    rmdir /s /q "backend\dist" 2>nul
)

REM Install dependencies if needed
if not exist "backend\node_modules" (
    echo Installing dependencies...
    cd backend
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo Dependencies installed
)

REM Always rebuild to ensure clean state
echo Building application...
cd backend
npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo Build completed

echo.
echo Starting backend server...
cd backend
start "Apply AI Backend - Development Server" cmd /k "npm run start:dev"
cd ..

echo.
echo Waiting for server to initialize (this takes 10-15 seconds)...
echo Please wait while the backend starts up...
timeout /t 15 /nobreak >nul

echo.
echo Checking server status...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 5).StatusCode } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo WARNING: Server may still be starting. Please wait a moment and check manually.
    echo If issues persist, the server window should show error details.
) else (
    echo SUCCESS: Server is responding correctly!
)

echo.
echo Opening web application...
start http://localhost:3000/index.html

echo.
echo =====================================
echo   Application Started!
echo =====================================
echo.
echo Backend: http://localhost:3000/api
echo Web App: http://localhost:3000/index.html
echo Health: http://localhost:3000/api/health
echo.
echo Press any key to close this window...
pause >nul
