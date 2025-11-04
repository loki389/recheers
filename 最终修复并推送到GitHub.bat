@echo off
cd /d "%~dp0"

echo ========================================
echo Final Fix for Vercel Deployment
echo ========================================
echo.
echo This will fix ALL deployment issues:
echo   1. TypeScript errors (HistoryTimeline)
echo   2. Vercel config (simplified)
echo   3. Remove .vercelignore (blocking app directory)
echo   4. Push everything to GitHub
echo.
pause

REM Verify fixes are in place
echo [Verify] Checking fixes...
echo.

if exist components\HistoryTimeline.tsx (
    echo    OK: HistoryTimeline.tsx exists
) else (
    echo    ERROR: HistoryTimeline.tsx missing!
    pause
    exit /b 1
)

if not exist .vercelignore (
    echo    OK: .vercelignore removed (was blocking app directory)
) else (
    echo    WARNING: .vercelignore still exists, removing...
    del .vercelignore
)

if exist vercel.json (
    echo    OK: vercel.json exists
) else (
    echo    ERROR: vercel.json missing!
    pause
    exit /b 1
)

if exist app\page.tsx (
    echo    OK: app directory exists
) else (
    echo    ERROR: app directory missing!
    pause
    exit /b 1
)

echo.
echo [Step 1] Adding all files...
git add .
if %errorlevel% neq 0 (
    echo    ERROR: Failed to add files
    pause
    exit /b 1
)
echo    OK: Files added
echo.

echo [Step 2] Committing changes...
git commit -m "Fix: All Vercel deployment issues - TypeScript errors, removed .vercelignore, simplified vercel.json"
if %errorlevel% == 0 (
    echo    OK: Changes committed
) else (
    echo    INFO: No changes to commit (may already be committed)
)
echo.

echo [Step 3] Pushing to GitHub...
echo.
echo NOTE: If asked for password, use GitHub Personal Access Token
echo       Get token: https://github.com/settings/tokens
echo       Select 'repo' scope
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! All fixes pushed to GitHub
    echo ========================================
    echo.
    echo Fixes included:
    echo   - TypeScript type errors fixed
    echo   - .vercelignore removed
    echo   - vercel.json simplified
    echo   - All code updated
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
    echo   - Permissions: Verify GitHub repo access
    echo.
)

pause




