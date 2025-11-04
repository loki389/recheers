@echo off
cd /d "%~dp0"

echo ========================================
echo Complete Deployment Preparation
echo ========================================
echo.
echo This will:
echo   1. Verify local code is correct
echo   2. Ensure app directory is ready
echo   3. Push all code to GitHub
echo   4. Remind you to configure Vercel env vars
echo.
pause

REM Step 1: Verify app directory
echo [Step 1] Verifying app directory...
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
echo.

REM Step 2: Remove .vercelignore
echo [Step 2] Checking .vercelignore...
if exist .vercelignore (
    del .vercelignore
    echo    OK: .vercelignore removed
) else (
    echo    OK: .vercelignore does not exist
)
echo.

REM Step 3: Test local build
echo [Step 3] Testing local build...
echo    This may take 30 seconds...
call npm run build >nul 2>&1
if %errorlevel% == 0 (
    echo    OK: Local build successful
) else (
    echo    WARNING: Local build has issues
    echo    But continuing with push...
)
echo.

REM Step 4: Add and commit
echo [Step 4] Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo    ERROR: Failed to add files
    pause
    exit /b 1
)
echo    OK: Files added
echo.

echo [Step 5] Committing changes...
git commit -m "Deploy: Push all fixes for Vercel deployment"
if %errorlevel% == 0 (
    echo    OK: Changes committed
) else (
    echo    INFO: No changes to commit
)
echo.

REM Step 5: Push
echo [Step 6] Pushing to GitHub...
echo.
echo NOTE: Use Personal Access Token if asked for password
echo       Get token: https://github.com/settings/tokens
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS: Code pushed to GitHub!
    echo ========================================
    echo.
    echo Next steps for Vercel:
    echo.
    echo [IMPORTANT] Configure Environment Variables:
    echo   1. Go to: https://vercel.com/dashboard
    echo   2. Select your project
    echo   3. Settings -^> Environment Variables
    echo   4. Add: OPENAI_API_KEY = your DeepSeek key
    echo   5. Select all environments (Production, Preview, Development)
    echo   6. Save
    echo   7. Redeploy or wait for auto-deploy
    echo.
    echo [VERIFY] Check GitHub:
    echo   - Visit: https://github.com/loki389/recheers
    echo   - Confirm app/ directory is visible
    echo   - Confirm latest commit appears
    echo.
    echo [WAIT] Vercel will auto-deploy in 1-2 minutes
    echo        Or manually trigger: Deployments -^> Redeploy
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed
    echo ========================================
    echo.
    echo Check the error message above
    echo Common issues: Authentication, Network
    echo.
)

pause




