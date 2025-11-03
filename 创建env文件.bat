@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo Create .env.local File
echo ========================================
echo.
echo This will create .env.local file for API key configuration
echo.

REM Check if file already exists
if exist .env.local (
    echo WARNING: .env.local already exists
    echo.
    echo Current content:
    type .env.local
    echo.
    echo Do you want to overwrite? (Y/N)
    choice /C YN /N /M "Your choice"
    if errorlevel 2 goto :end
    if errorlevel 1 goto :create
) else (
    goto :create
)

:create
echo.
echo Please enter your DeepSeek API Key:
echo (Format: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
echo.
set /p API_KEY="API Key: "

if "%API_KEY%"=="" (
    echo ERROR: API Key cannot be empty
    pause
    exit /b 1
)

echo OPENAI_API_KEY=%API_KEY% > .env.local
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS: .env.local created
    echo ========================================
    echo.
    echo File location: %CD%\.env.local
    echo.
    echo IMPORTANT: Restart the development server!
    echo   1. Stop current server (Ctrl+C)
    echo   2. Run: npm run dev
    echo   3. Test the website
    echo.
) else (
    echo ERROR: Failed to create .env.local
)

:end
pause

