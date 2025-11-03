@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo Complete Server Restart
echo ========================================
echo.

echo [Step 1] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo    Done
echo.

echo [Step 2] Clearing all caches...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist tsconfig.tsbuildinfo del /f /q tsconfig.tsbuildinfo
echo    Done
echo.

echo [Step 3] Verifying app directory...
if exist app (
    echo    OK: app directory exists
) else (
    echo    ERROR: app directory missing!
    pause
    exit /b 1
)
echo.

echo [Step 4] Starting development server...
echo.
echo ========================================
echo Server is starting...
echo ========================================
echo.
echo IMPORTANT:
echo   - Wait 20-30 seconds for compilation
echo   - Watch for "Ready" message
echo   - Then open: http://localhost:3000
echo   - Use Ctrl + F5 to force refresh
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

