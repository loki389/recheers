@echo off
chcp 65001 >nul
echo ========================================
echo   打开项目终端 - 酒别重逢项目
echo ========================================
echo.
echo 当前目录: %CD%
echo.
echo 选择终端类型:
echo   1. PowerShell (推荐)
echo   2. CMD (命令提示符)
echo.
set /p choice="请输入选择 (1 或 2): "

if "%choice%"=="1" (
    echo.
    echo 正在打开 PowerShell...
    start powershell -NoExit -Command "cd /d %CD%"
) else if "%choice%"=="2" (
    echo.
    echo 正在打开 CMD...
    start cmd /k "cd /d %CD%"
) else (
    echo.
    echo 无效选择，默认打开 PowerShell...
    start powershell -NoExit -Command "cd /d %CD%"
)

echo.
echo 终端已打开！
echo.
pause


