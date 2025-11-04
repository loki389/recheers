@echo off
chcp 65001 >nul
cd /d %~dp0

echo ========================================
echo   快速部署脚本 - 酒别重逢项目
echo ========================================
echo.
echo 当前目录: %CD%
echo.

REM 检查 Git 是否安装
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Git！
    echo.
    echo 请先安装 Git:
    echo   1. 访问 https://git-scm.com/download/win
    echo   2. 或下载 GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo [OK] Git 已安装
echo.

REM 检查是否是 Git 仓库
if not exist ".git" (
    echo [信息] 初始化 Git 仓库...
    git init
    echo.
)

echo 执行以下 Git 命令:
echo.
echo 1. 添加所有文件...
git add .
echo.

echo 2. 检查将被提交的文件...
git status --short
echo.

set /p commit_msg="请输入提交信息 (直接回车使用默认): "
if "%commit_msg%"=="" set commit_msg=Initial commit: 酒别重逢项目完整文件

echo.
echo 3. 提交文件...
git commit -m "%commit_msg%"
echo.

echo 4. 检查 app 目录是否在 Git 中...
git ls-files app/
echo.

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   [成功] 文件已提交到 Git！
    echo ========================================
    echo.
    echo 下一步操作:
    echo   1. 在 GitHub 创建新仓库
    echo   2. 执行以下命令连接到远程仓库:
    echo      git remote add origin https://github.com/你的用户名/仓库名.git
    echo      git branch -M main
    echo      git push -u origin main
    echo   3. 在 Vercel 中导入项目
    echo.
) else (
    echo.
    echo [警告] app 目录中的文件可能没有被添加
    echo.
)

pause


