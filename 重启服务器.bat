@echo off
chcp 65001 >nul
cd /d %~dp0

echo ========================================
echo   重启开发服务器 - 酒别重逢项目
echo ========================================
echo.

echo [1/3] 停止所有 Node 进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] 已停止
echo.

echo [2/3] 清理构建缓存...
if exist ".next" (
    rmdir /s /q ".next" >nul 2>&1
    echo [OK] 已清理
) else (
    echo [INFO] 无需清理
)
echo.

echo [3/3] 启动开发服务器...
echo.
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 可停止服务器
echo.
echo ========================================
echo.

npm run dev

pause


