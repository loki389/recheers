@echo off
chcp 65001 >nul
cd /d %~dp0

title 酒别重逢 - 开发服务器

echo ========================================
echo   启动开发服务器 - 酒别重逢项目
echo ========================================
echo.
echo 正在启动服务器...
echo.
echo 📍 访问地址: http://localhost:3000
echo 🛑 停止服务器: 按 Ctrl+C
echo.
echo ========================================
echo.

npm run dev

pause

