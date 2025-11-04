@echo off
cd /d "%~dp0"

echo ========================================
echo Fix API Key and Restart Server
echo ========================================
echo.

REM Step 1: Check .env.local
echo [Step 1] Checking .env.local...
if exist .env.local (
    echo    OK: .env.local exists
    echo    Current content:
    type .env.local
    echo.
) else (
    echo    ERROR: .env.local not found!
    echo    Please create it first using: 创建env文件.bat
    pause
    exit /b 1
)
echo.

REM Step 2: Stop Node processes
echo [Step 2] Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo    Done
echo.

REM Step 3: Clear cache
echo [Step 3] Clearing cache...
if exist .next rmdir /s /q .next >nul 2>&1
echo    Done
echo.

REM Step 4: Restart server
echo [Step 4] Starting development server...
echo.
echo ========================================
echo IMPORTANT:
echo ========================================
echo 1. Wait 20-30 seconds for server to start
echo 2. Look for "Ready" message in terminal
echo 3. Open: http://localhost:3000
echo 4. Test AI chat feature
echo.
echo If API key error persists:
echo   - Verify key is DeepSeek API key (not OpenAI)
echo   - Check account balance at: https://platform.deepseek.com
echo   - Update .env.local with correct key
echo.
echo Press Ctrl+C to stop server
echo ========================================
echo.

npm run dev




