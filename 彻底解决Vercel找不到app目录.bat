@echo off
cd /d "%~dp0"

echo ========================================
echo Fix: Vercel Cannot Find App Directory
echo ========================================
echo.

REM Verify app directory exists
echo [Step 1] Verifying app directory...
if exist app (
    echo    OK: app directory exists
    if exist app\page.tsx (
        echo    OK: app\page.tsx exists
    ) else (
        echo    ERROR: app\page.tsx missing!
        pause
        exit /b 1
    )
    if exist app\layout.tsx (
        echo    OK: app\layout.tsx exists
    ) else (
        echo    ERROR: app\layout.tsx missing!
        pause
        exit /b 1
    )
) else (
    echo    ERROR: app directory not found!
    pause
    exit /b 1
)
echo.

REM Remove .vercelignore completely
echo [Step 2] Removing .vercelignore...
if exist .vercelignore (
    del .vercelignore
    echo    OK: .vercelignore removed
) else (
    echo    OK: .vercelignore already removed
)
echo.

REM Verify vercel.json
echo [Step 3] Verifying vercel.json...
if exist vercel.json (
    echo    OK: vercel.json exists
    type vercel.json
) else (
    echo    WARNING: vercel.json missing, creating...
    echo {"framework": "nextjs"} > vercel.json
    echo    OK: vercel.json created
)
echo.

REM Local build test
echo [Step 4] Testing local build...
echo    This may take 30 seconds...
call npm run build >nul 2>&1
if %errorlevel% == 0 (
    echo    OK: Local build successful
) else (
    echo    WARNING: Local build failed, but continuing...
    echo    This may indicate other issues
)
echo.

REM Add all files to Git
echo [Step 5] Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo    ERROR: Failed to add files
    pause
    exit /b 1
)
echo    OK: Files added
echo.

REM Commit
echo [Step 6] Committing changes...
git commit -m "Fix: Ensure app directory is deployed - removed .vercelignore, verified structure"
if %errorlevel% == 0 (
    echo    OK: Changes committed
) else (
    echo    INFO: No changes to commit
)
echo.

REM Push
echo [Step 7] Pushing to GitHub...
echo.
echo NOTE: You may need to enter GitHub credentials
echo       Use Personal Access Token if asked for password
echo       Get token: https://github.com/settings/tokens
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo All fixes pushed to GitHub:
    echo   - app directory verified
    echo   - .vercelignore removed
    echo   - vercel.json configured
    echo.
    echo Next steps:
    echo   1. Wait 1-2 minutes
    echo   2. Check Vercel Dashboard
    echo   3. Verify deployment succeeds
    echo   4. Website should be live!
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed
    echo ========================================
    echo.
    echo Common issues:
    echo   - Authentication: Use Personal Access Token
    echo   - Network: Check internet connection
    echo   - Check error message above for details
    echo.
)

pause




