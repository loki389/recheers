@echo off
chcp 65001 >nul
cd /d %~dp0

title 检查并启动开发服务器

echo ========================================
echo   检查并启动开发服务器
echo ========================================
echo.

:: 检查 .env.local 文件
if exist .env.local (
    echo [✓] .env.local 文件存在
    echo.
    echo 当前配置:
    type .env.local
    echo.
) else (
    echo [✗] .env.local 文件不存在
    echo.
    echo 请创建 .env.local 文件并添加:
    echo OPENAI_API_KEY=你的DeepSeek密钥
    echo.
    pause
    exit /b 1
)

:: 检查端口 3000 是否被占用
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo [信息] 端口 3000 已被占用，可能服务器已经在运行
    echo.
    echo 请访问: http://localhost:3000
    echo.
    echo 如果无法访问，请先停止占用端口的进程
    echo.
    pause
    exit /b 0
) else (
    echo [信息] 端口 3000 未被占用，正在启动服务器...
    echo.
)

echo ========================================
echo   启动开发服务器
echo ========================================
echo.
echo 📍 访问地址: http://localhost:3000
echo 🛑 停止服务器: 按 Ctrl+C
echo.
echo ========================================
echo.

npm run dev

pause


