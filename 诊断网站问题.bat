@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo Website Diagnostic Tool
echo ========================================
echo.

echo [Check 1] Verifying app directory...
if exist app (
    echo    OK: app directory exists
    if exist app\page.tsx (
        echo    OK: app\page.tsx exists
    ) else (
        echo    ERROR: app\page.tsx missing!
    )
    if exist app\layout.tsx (
        echo    OK: app\layout.tsx exists
    ) else (
        echo    ERROR: app\layout.tsx missing!
    )
) else (
    echo    ERROR: app directory not found!
)
echo.

echo [Check 2] Checking Node processes...
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I /N "node.exe">nul
if "%ERRORLEVEL%"=="0" (
    echo    OK: Node processes running
) else (
    echo    WARNING: No Node processes found
)
echo.

echo [Check 3] Checking port 3000...
netstat -ano | findstr ":3000" >nul
if %errorlevel% == 0 (
    echo    OK: Port 3000 is listening
) else (
    echo    WARNING: Port 3000 is not in use
)
echo.

echo [Check 4] Checking .next directory...
if exist .next (
    echo    INFO: .next directory exists (may be stale)
) else (
    echo    INFO: .next directory does not exist
)
echo.

echo ========================================
echo Recommended Actions:
echo ========================================
echo.
echo If website is not working:
echo.
echo 1. Restart the server:
echo    - Run: 智能重启服务器.bat
echo    - Or: 重启开发服务器.bat
echo.
echo 2. Clear browser cache:
echo    - Press Ctrl + Shift + Delete
echo    - Clear cache and cookies
echo    - Or use Incognito/Private mode
echo.
echo 3. Check browser console:
echo    - Press F12 in browser
echo    - Check Console tab for errors
echo    - Check Network tab for failed requests
echo.
echo 4. Try different browser or incognito mode
echo.
echo 5. Check terminal window running npm run dev
echo    - Look for compilation errors
echo    - Wait for "Ready" message
echo.
pause

