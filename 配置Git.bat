@echo off
chcp 65001 >nul
echo ========================================
echo Git 配置脚本
echo ========================================
echo.

REM 检查 Git 是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git！
    echo.
    echo 请先安装 Git：
    echo 1. 访问 https://git-scm.com/download/win
    echo 2. 下载并安装 Git for Windows
    echo 3. 安装时选择 "Add Git to PATH" 选项
    echo 4. 安装完成后重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [成功] 检测到 Git 已安装
echo.

REM 显示当前配置
echo 当前 Git 配置：
echo ----------------------------------------
git config --global user.name
git config --global user.email
echo ----------------------------------------
echo.

REM 询问用户信息
set /p USERNAME="请输入您的用户名（或直接回车使用当前配置）: "
set /p USEREMAIL="请输入您的邮箱（或直接回车使用当前配置）: "

REM 设置用户名
if not "%USERNAME%"=="" (
    git config --global user.name "%USERNAME%"
    echo [成功] 用户名已设置为: %USERNAME%
) else (
    echo [跳过] 保持当前用户名配置
)

REM 设置邮箱
if not "%USEREMAIL%"=="" (
    git config --global user.email "%USEREMAIL%"
    echo [成功] 邮箱已设置为: %USEREMAIL%
) else (
    echo [跳过] 保持当前邮箱配置
)

echo.
echo ========================================
echo 配置完成！当前配置：
echo ========================================
git config --global user.name
git config --global user.email
echo ========================================
echo.

REM 询问是否初始化仓库
set /p INIT_REPO="是否在当前目录初始化 Git 仓库？(y/n): "
if /i "%INIT_REPO%"=="y" (
    cd /d "%~dp0"
    if exist ".git" (
        echo [信息] 当前目录已经是 Git 仓库
    ) else (
        git init
        echo [成功] Git 仓库初始化完成
    )
)

echo.
pause

