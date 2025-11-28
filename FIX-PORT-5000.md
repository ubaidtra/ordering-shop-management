# Fix Port 5000 Already in Use

## Problem
Port 5000 is already in use, preventing the dev server from starting.

## Solution

### Quick Fix: Kill Process Using Port 5000

**Windows PowerShell:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Or kill all node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Alternative: Use Different Port**

Change the port in `package.json`:
```json
"dev": "next dev -p 3000",
"start": "next start -p 3000"
```

Then run:
```bash
npm run dev
```

### Permanent Solution

If this happens frequently, you can:

1. **Use a different port** (recommended):
   - Change port to 3000 or 3001 in `package.json`
   - Update all references to port 5000

2. **Create a port checker script**:
   ```powershell
   # Check if port is in use
   $port = 5000
   $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
   if ($connection) {
       Write-Host "Port $port is in use by PID: $($connection.OwningProcess)"
   } else {
       Write-Host "Port $port is available"
   }
   ```

3. **Auto-kill on startup** (add to package.json scripts):
   ```json
   "predev": "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -eq ''} | Stop-Process -Force -ErrorAction SilentlyContinue"
   ```

## Current Status

✅ Port 5000 has been freed. You can now run:
```bash
npm run dev
```

