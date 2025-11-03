@echo off
chcp 65001 >nul
echo ========================================
echo 重启开发服务器
echo ========================================
echo.

echo [1/3] 停止现有 Node 进程...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [成功] 已停止 Node 进程
) else (
    echo [信息] 没有运行中的 Node 进程
)

echo.
echo [2/3] 清除构建缓存...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
    echo [成功] 已清除 .next 缓存
) else (
    echo [信息] .next 目录不存在
)

echo.
echo [3/3] 启动开发服务器...
echo.
echo 正在启动，请稍候...
echo 服务器启动后，请在浏览器访问: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

cd /d "%~dp0"
npm run dev

