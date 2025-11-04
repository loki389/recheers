@echo off
cd /d "%~dp0"

echo ========================================
echo Fix Vercel Deployment - Complete Fix
echo ========================================
echo.
echo This will:
echo   1. Remove .vercelignore (may block app directory)
echo   2. Verify app directory exists
echo   3. Ensure all files are committed
echo   4. Push to GitHub
echo.
pause

REM Remove .vercelignore if it exists
if exist .vercelignore (
    echo [Step 1] Removing .vercelignore...
    del .vercelignore
    echo    OK: .vercelignore removed
) else (
    echo [Step 1] .vercelignore does not exist
)
echo.

REM Verify app directory
echo [Step 2] Verifying app directory...
if exist app (
    echo    OK: app directory exists
    dir app /b
) else (
    echo    ERROR: app directory not found!
    pause
    exit /b 1
)
echo.

REM Add all files
echo [Step 3] Adding all files to Git...
git add .
if %errorlevel% == 0 (
    echo    OK: Files added
) else (
    echo    ERROR: Failed to add files
    pause
    exit /b 1
)
echo.

REM Commit
echo [Step 4] Committing changes...
git commit -m "Fix: Remove .vercelignore, ensure app directory is deployed"
if %errorlevel% == 0 (
    echo    OK: Changes committed
) else (
    echo    INFO: No changes to commit
)
echo.

REM Push
echo [Step 5] Pushing to GitHub...
echo.
echo NOTE: If asked for password, use GitHub Personal Access Token
echo       Get token at: https://github.com/settings/tokens
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Next steps:
    echo   1. Wait 1-2 minutes
    echo   2. Check Vercel Dashboard
    echo   3. Verify deployment succeeds
    echo.
) else (
    echo.
    echo ERROR: Push failed
    echo Check the error message above
    echo.
)

pause




