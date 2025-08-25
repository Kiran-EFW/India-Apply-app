# Apply AI India - Simple PowerShell Launcher
# Reliable startup script with error prevention

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   Apply AI India - PowerShell Start" -ForegroundColor White  
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "backend\package.json")) {
    Write-Host "ERROR: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Kill existing Node processes to prevent conflicts
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Create .env if missing
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

# Clean old build to prevent entity errors
if (Test-Path "backend\dist") {
    Write-Host "Cleaning old build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "backend\dist" -ErrorAction SilentlyContinue
    Write-Host "✓ Old build cleaned" -ForegroundColor Green
}

# Install dependencies if needed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location "backend"
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Set-Location ".."
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ".."
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Build application
Write-Host "Building application..." -ForegroundColor Yellow
Set-Location "backend"
npm run build --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ".."
Write-Host "✓ Build completed" -ForegroundColor Green

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow

# Start backend server
Set-Location "backend"
Start-Process -FilePath "cmd" -ArgumentList "/k", "npm run start:dev" -WindowStyle Normal
Set-Location ".."

Write-Host "✓ Backend server is starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for server startup..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   Application Ready!" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Backend API:   http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "🌐 Web App:      http://localhost:3000/index.html" -ForegroundColor Cyan  
Write-Host "📊 Health:       http://localhost:3000/api/health" -ForegroundColor Cyan
Write-Host ""

# Open browser
Write-Host "Opening web application..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/index.html"

Write-Host ""
Write-Host "Backend server is running in a separate window." -ForegroundColor Green
Write-Host "Close that window to stop the server." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close this window"
