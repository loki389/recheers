@echo off
cd /d "%~dp0"

echo ========================================
echo Check Vercel Auto-Deploy Status
echo ========================================
echo.

echo [Check 1] Verifying Git repository...
git remote -v
if %errorlevel% neq 0 (
    echo    ERROR: No remote repository configured
    echo    Solution: git remote add origin https://github.com/loki389/recheers.git
) else (
    echo    OK: Remote repository configured
)
echo.

echo [Check 2] Checking recent commits...
git log --oneline -5
if %errorlevel% neq 0 (
    echo    WARNING: Could not read git log
) else (
    echo    OK: Found commits
)
echo.

echo [Check 3] Checking for uncommitted changes...
git status --short
if %errorlevel% neq 0 (
    echo    WARNING: Could not check status
) else (
    echo    OK: Status checked
)
echo.

echo ========================================
echo Vercel Auto-Deploy Requirements:
echo ========================================
echo.
echo 1. Code must be pushed to GitHub
echo    Current status: Check above
echo.
echo 2. Vercel must be connected to GitHub
echo    Verify at: https://vercel.com/dashboard
echo    Go to: Project Settings -^> Git
echo    Ensure: Connected to loki389/recheers
echo.
echo 3. Auto-Deploy must be enabled
echo    Verify at: https://vercel.com/dashboard
echo    Go to: Project Settings -^> Git
echo    Ensure: Auto-Deploy is Enabled
echo.
echo ========================================
echo.
echo If code is not pushed:
echo   - Run: 最终修复并推送到GitHub.bat
echo.
echo To verify deployment:
echo   - Check: https://vercel.com/dashboard
echo   - Look for new deployments after pushing
echo.
pause

