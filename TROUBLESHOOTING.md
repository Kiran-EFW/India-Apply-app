# Apply AI India - Troubleshooting Guide

## Server Startup Issues

### 🔥 **Common Problem: Server Appears Not to Start**

#### Symptoms:
- `curl http://localhost:3000/api/health` fails with "Unable to connect"
- `netstat -an | findstr :3000` shows TIME_WAIT connections
- No node processes visible in task manager

#### Root Cause:
**NestJS takes 10-15 seconds to fully initialize!** The server is starting but needs more time.

#### ✅ **Solutions:**

##### Option 1: Use Reliable Startup Scripts
```cmd
.\start-simple.bat          # Most reliable for Windows
.\start-powershell.ps1      # PowerShell with job management
.\dev-setup.bat             # Full development environment
```

##### Option 2: Manual PowerShell Start (Recommended)
```powershell
# Start as background job
cd backend
$job = Start-Job -ScriptBlock { 
    Set-Location "C:\Users\kiran\Documents\VS code files\Apply AI\backend"
    npm run start:dev 
}

# Wait 15 seconds
Start-Sleep -Seconds 15

# Check if running
curl http://localhost:3000/api/health

# View server logs
Receive-Job -Id $job.Id
```

##### Option 3: Direct Node Start
```cmd
cd backend
node dist/main.js
# Wait for "Nest application successfully started" message
```

### 🚫 **PowerShell && Operator Issue**

#### Problem:
```powershell
cd backend && npm run start:dev  # ❌ Fails in PowerShell
```

#### Solutions:
```powershell
# Use semicolon
cd backend; npm run start:dev  # ✅ Works

# Use separate commands
cd backend
npm run start:dev  # ✅ Works

# Use Start-Job (best for background)
Start-Job -ScriptBlock { Set-Location "path\to\backend"; npm run start:dev }
```

## Timing Issues

### Server Initialization Time
- **Expected**: 10-15 seconds for full startup
- **Signs of Success**: Look for these log messages:
  - `Starting compilation in watch mode...`
  - `Found 0 errors. Watching for file changes.`
  - `[Nest] Starting Nest application...`
  - `Nest application successfully started`
  - `🚀 Apply AI India Backend running on port 3000`

### Health Check Validation
```powershell
# Test health endpoint
$response = Invoke-WebRequest http://localhost:3000/api/health
$response.StatusCode  # Should be 200
$response.Content     # Should show JSON health data
```

## Process Management

### Check Running Processes
```powershell
# Check node processes
Get-Process -Name node -ErrorAction SilentlyContinue

# Check port usage
netstat -an | findstr :3000

# Check PowerShell jobs
Get-Job
```

### Stop Servers
```powershell
# Stop all node processes
Get-Process node | Stop-Process -Force

# Stop specific job
Stop-Job -Id <JobId>
Remove-Job -Id <JobId>

# Kill port 3000 processes
netstat -ano | findstr :3000
# Note the PID and kill it
taskkill /PID <PID> /F
```

## Build Issues

### Clean Build Process
```cmd
cd backend

# Clean old build
rmdir /s /q dist

# Reinstall dependencies
rmdir /s /q node_modules
npm install

# Build fresh
npm run build

# Start server
npm run start:dev
```

### Common Build Errors
- **TypeScript compilation errors**: Check src files for syntax errors
- **Missing dependencies**: Run `npm install`
- **Port in use**: Kill existing processes on port 3000

## Environment Configuration

### Required Files
- `backend/.env` (copy from `backend/env.example`)
- `backend/package.json`
- `backend/dist/` (created by `npm run build`)
- `backend/node_modules/` (created by `npm install`)

### Database
- **Development**: Uses SQLite (`backend/database.sqlite`)
- **No setup required**: Database auto-created on first run

## Quick Diagnostic Commands

```powershell
# Full diagnostic check
Write-Host "Checking Node.js..." -ForegroundColor Yellow
node --version

Write-Host "Checking npm..." -ForegroundColor Yellow
npm --version

Write-Host "Checking backend files..." -ForegroundColor Yellow
Get-ChildItem backend -Name

Write-Host "Checking for running servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue
netstat -an | findstr :3000

Write-Host "Testing server connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest http://localhost:3000/api/health -TimeoutSec 5
    Write-Host "✅ Server is running! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not responding" -ForegroundColor Red
}
```

## Success Indicators

### ✅ Server is Working When You See:
1. **Health endpoint responds**: `curl http://localhost:3000/api/health` returns 200
2. **Web app loads**: `http://localhost:3000/index.html` shows the application
3. **Status indicator**: Green dot in top-right of web app
4. **Console logs**: Show "Nest application successfully started"

### 🎯 **Expected Startup Time**: 10-15 seconds

### 🚀 **Best Practice**: Use `.\start-simple.bat` or PowerShell job management for reliable startup.
