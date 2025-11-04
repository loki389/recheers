@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo View API Key Configuration
echo ========================================
echo.

if exist .env.local (
    echo Current .env.local content:
    echo.
    type .env.local
    echo.
    echo ========================================
    echo IMPORTANT NOTES:
    echo ========================================
    echo.
    echo 1. This key should be a DEEPSEEK API key
    echo    NOT an OpenAI key
    echo.
    echo 2. If this is an old OpenAI key, you need:
    echo    - Get new DeepSeek key: https://platform.deepseek.com
    echo    - Update .env.local file
    echo    - Restart development server
    echo.
    echo 3. For Vercel deployment:
    echo    - Use the SAME key
    echo    - Configure in Vercel Dashboard
    echo    - Settings -^> Environment Variables
    echo.
) else (
    echo .env.local file does not exist!
    echo.
    echo To create it:
    echo   1. Run: 创建env文件.bat
    echo   2. Or manually create .env.local with:
    echo      OPENAI_API_KEY=your_deepseek_key
    echo.
)

pause




