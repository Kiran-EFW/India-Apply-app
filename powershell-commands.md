# PowerShell Command Reference for Apply AI India

## The Problem
PowerShell doesn't support the `&&` operator like CMD does. This causes errors when running commands like:
```powershell
cd backend && npm run start:dev  # ❌ This fails in PowerShell
```

## Solutions

### ✅ **Recommended: Use Background Jobs (Most Reliable)**
```powershell
# Start server as background job that keeps running
$job = Start-Job -ScriptBlock { 
    Set-Location "C:\Users\kiran\Documents\VS code files\Apply AI\backend"
    npm run start:dev 
}

# Check job status
Get-Job -Id $job.Id

# View job output
Receive-Job -Id $job.Id
```

### Option 1: Use Semicolon (;)
```powershell
cd backend; npm run start:dev  # ✅ Works in PowerShell
```

### Option 2: Use Set-Location
```powershell
Set-Location backend; npm run start:dev  # ✅ PowerShell native command
```

### Option 3: Separate Commands
```powershell
cd backend
npm run start:dev  # ✅ Run commands separately
```

### Option 4: Use Our Enhanced PowerShell Script
```powershell
.\start-powershell.ps1  # ✅ PowerShell-compatible startup script with job management
```

## Common Commands for Apply AI India

### Start Development Server
```powershell
# Wrong way (causes error)
cd backend && npm run start:dev

# Correct ways
cd backend; npm run start:dev
# OR
Set-Location backend; npm run start:dev
# OR
cd backend
npm run start:dev
```

### Build and Start
```powershell
# Wrong way
cd backend && npm run build && npm run start:dev

# Correct way
cd backend; npm run build; npm run start:dev
# OR
Set-Location backend
npm run build
npm run start:dev
```

### Check Health
```powershell
Invoke-WebRequest http://localhost:3000/api/health
# OR
curl http://localhost:3000/api/health
```

## Available Startup Scripts

1. **start-simple.bat** - CMD batch file (most reliable)
2. **start-powershell.ps1** - PowerShell compatible version
3. **start.ps1** - Original PowerShell script
4. **dev-setup.bat** - Development environment setup
5. **quick-start.bat** - Interactive menu (now includes PowerShell option)

## Recommendation
Use `.\start-simple.bat` for most reliable startup, or `.\start-powershell.ps1` if you prefer PowerShell syntax.
