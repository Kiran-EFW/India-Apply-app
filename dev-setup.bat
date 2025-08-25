@echo off
setlocal enabledelayedexpansion

echo.
echo =========================================
echo   Apply AI India - Development Setup
echo =========================================
echo.

REM Set color for better visibility
color 0B

REM Change to project root directory
cd /d "%~dp0"

REM Kill any existing Node processes to prevent conflicts
echo [SETUP] Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul >nul
echo.

REM Check prerequisites
echo [1/8] Checking prerequisites...
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)
echo ✓ Prerequisites check passed

REM Environment setup
echo.
echo [2/8] Environment configuration...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env" >nul
    echo ✓ Created .env file
    echo.
    echo IMPORTANT: Update backend\.env with your configuration:
    echo - JWT_SECRET: Change to a secure random string
    echo - Database credentials if using PostgreSQL
    echo - API keys for external services
    echo.
) else (
    echo ✓ .env file exists
)

REM Clean previous builds to prevent entity errors
echo.
echo [3/8] Cleaning previous builds...
if exist "backend\dist\" (
    rmdir /s /q "backend\dist"
    echo ✓ Cleaned backend dist folder (prevents old entity errors)
)
if exist "backend\database.sqlite" (
    echo ✓ SQLite database exists (preserving data)
) else (
    echo ✓ Fresh database will be created
)

REM Install backend dependencies
echo.
echo [4/8] Installing/updating backend dependencies...
cd backend
npm ci --silent
if !errorlevel! neq 0 (
    echo ERROR: Failed to install backend dependencies
    echo Trying with npm install...
    npm install
    if !errorlevel! neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)
echo ✓ Backend dependencies ready

REM Check for vulnerabilities
echo.
echo [5/8] Security audit...
npm audit --audit-level moderate --silent
if !errorlevel! neq 0 (
    echo WARNING: Security vulnerabilities found
    echo Run 'npm audit fix' in backend directory to fix
)

REM Build backend
echo.
echo [6/8] Building backend...
npm run build
if !errorlevel! neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Backend built successfully

REM Verify web assets
echo.
echo [7/8] Verifying web assets...
cd ..
if exist "web\index.html" (
    echo ✓ Web application files found
) else (
    echo ERROR: Web application files missing
    pause
    exit /b 1
)

REM Final startup
echo.
echo [8/8] Starting development server...
cd backend
start "Apply AI India - Development Server" cmd /k "npm run start:dev"

echo.
echo ✓ Development server starting...
echo.
echo Waiting for server to be ready...
:dev_wait_loop
timeout /t 3 /nobreak >nul
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 5).StatusCode } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 goto dev_ready
echo Still starting up...
goto dev_wait_loop

:dev_ready
echo.
echo =========================================
echo   Development Environment Ready!
echo =========================================
echo.
echo 🚀 Backend (Dev): http://localhost:3000/api
echo 🌐 Frontend: http://localhost:3000/index.html
echo 📊 Health: http://localhost:3000/api/health
echo 📁 Static Files: http://localhost:3000/
echo.
echo Development Features:
echo • Hot reload enabled
echo • SQLite database (development)
echo • Detailed logging
echo • CORS enabled for all origins
echo.

REM Open in default browser
start http://localhost:3000/index.html

echo Server logs will appear in the separate terminal window.
echo Press any key to close this setup window...
pause >nul
