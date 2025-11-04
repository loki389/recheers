@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo Push Code to GitHub
echo ========================================
echo.
echo Current directory: %CD%
echo.

REM Check Git repository
echo [Step 1/5] Checking Git repository...
if not exist .git (
    echo    Initializing Git repository...
    git init
    git config user.name "loki389"
    git config user.email "loki82576@gmail.com"
    echo    OK: Git repository initialized
) else (
    echo    OK: Git repository exists
)
echo.

REM Check remote repository
echo [Step 2/5] Checking remote repository...
git remote -v
if %errorlevel% neq 0 (
    echo    Configuring remote repository...
    git remote add origin https://github.com/loki389/recheers.git
    git branch -M main
    echo    OK: Remote repository configured
) else (
    echo    OK: Remote repository configured
)
echo.

REM Check branch
echo [Step 3/5] Checking branch...
git branch -M main
echo    Current branch: main
echo.

REM Add files
echo [Step 4/5] Adding files...
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
echo [Step 5/5] Committing changes...
git commit -m "Fix: HistoryTimeline TypeScript type error and Vercel config"
if %errorlevel% == 0 (
    echo    OK: Changes committed
) else (
    echo    INFO: No changes to commit
)
echo.

REM Push
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.
echo Target: https://github.com/loki389/recheers.git
echo Branch: main
echo.
echo Note: You may need to enter GitHub credentials
echo      - Username: loki389
echo      - Password: Use Personal Access Token (not password)
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS: Code pushed to GitHub!
    echo ========================================
    echo.
    echo Next steps:
    echo    1. Open: https://github.com/loki389/recheers
    echo    2. Refresh the page (F5)
    echo    3. Verify the latest commit appears
    echo    4. Vercel will auto-deploy in 1-2 minutes
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Push failed
    echo ========================================
    echo.
    echo Common issues:
    echo.
    echo [Issue 1] Authentication failed
    echo    Solution: Use GitHub Personal Access Token
    echo    Steps:
    echo      1. Go to: https://github.com/settings/tokens
    echo      2. Generate new token (classic)
    echo      3. Select 'repo' scope
    echo      4. Copy the token
    echo      5. When asked for password, paste the token
    echo.
    echo [Issue 2] Permission denied
    echo    Solution: Check repository permissions
    echo    Verify: You have push access to loki389/recheers
    echo.
    echo [Issue 3] Network error
    echo    Solution: Check internet connection
    echo    Verify: Can access https://github.com
    echo.
    echo Manual push command:
    echo    git push -u origin main
    echo.
)

pause




