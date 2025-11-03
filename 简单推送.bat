@echo off
cd /d "%~dp0"

echo Adding files...
git add .

echo Committing...
git commit -m "Fix TypeScript errors"

echo Pushing to GitHub...
echo.
echo If asked for password, use GitHub Personal Access Token
echo Get token at: https://github.com/settings/tokens
echo.
git push -u origin main

if %errorlevel% == 0 (
    echo.
    echo SUCCESS! Code pushed to GitHub
    echo Check: https://github.com/loki389/recheers
) else (
    echo.
    echo Push failed. Check error message above.
)

pause

