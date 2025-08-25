# Apply AI India - PowerShell Compatible Startup Script
# Fixes the && operator issue in PowerShell

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

# PowerShell-compatible server startup using Start-Job (more reliable)
Set-Location "backend"
$serverJob = Start-Job -ScriptBlock { 
    Set-Location "C:\Users\kiran\Documents\VS code files\Apply AI\backend"
    npm run start:dev 
}
Set-Location ".."

Write-Host "✓ Backend server is starting as background job (ID: $($serverJob.Id))..." -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for server initialization (10-15 seconds required)..." -ForegroundColor Yellow
Write-Host "Please be patient while the server starts up..." -ForegroundColor Gray

# Wait and check periodically
for ($i = 1; $i -le 15; $i++) {
    Start-Sleep -Seconds 1
    Write-Progress -Activity "Starting Server" -Status "Initializing... ($i/15 seconds)" -PercentComplete (($i / 15) * 100)
    
    # Check if server is responding after 10 seconds
    if ($i -ge 10) {
        try {
            $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Server is responding successfully!" -ForegroundColor Green
                break
            }
        } catch {
            # Continue waiting
        }
    }
}

# Final status check
try {
    $healthCheck = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Server health check passed!" -ForegroundColor Green
} catch {
    Write-Host "⚠ Server may still be starting. Check the job output:" -ForegroundColor Yellow
    Write-Host "  Get-Job -Id $($serverJob.Id)" -ForegroundColor Cyan
    Write-Host "  Receive-Job -Id $($serverJob.Id)" -ForegroundColor Cyan
}

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
Write-Host "TIP: To avoid PowerShell && errors, use:" -ForegroundColor Yellow
Write-Host "  Set-Location backend; npm run start:dev" -ForegroundColor Cyan
Write-Host "  Instead of: cd backend && npm run start:dev" -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to close this window"
