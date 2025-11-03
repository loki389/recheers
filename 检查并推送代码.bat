@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 📊 检查 Git 状态并推送代码
echo ========================================
echo.
echo 当前目录: %CD%
echo.

REM 检查是否是 Git 仓库
if not exist .git (
    echo [错误] 当前目录不是 Git 仓库！
    echo.
    echo 正在初始化 Git 仓库...
    git init
    git config user.name "loki389"
    git config user.email "loki82576@gmail.com"
    git remote add origin https://github.com/loki389/recheers.git
    echo    ✓ Git 仓库已初始化
    echo.
)

echo [1/4] 检查 Git 状态...
git status
echo.
pause

echo [2/4] 添加所有更改的文件...
git add .
if %errorlevel% == 0 (
    echo    ✓ 文件已添加到暂存区
) else (
    echo    ✗ 添加文件失败
    pause
    exit /b 1
)
echo.

echo [3/4] 提交更改...
git commit -m "修复：HistoryTimeline TypeScript 类型错误和 Vercel 配置"
if %errorlevel% == 0 (
    echo    ✓ 提交成功
) else (
    echo    [信息] 没有需要提交的更改，或已经提交过了
)
echo.

echo [4/4] 检查远程仓库配置...
git remote -v
echo.

echo [推送] 推送到 GitHub...
git branch -M main
git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 📝 验证步骤：
    echo    1. 打开 https://github.com/loki389/recheers
    echo    2. 刷新页面（F5）
    echo    3. 应该能看到最新的提交
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ 推送失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo    1. 网络连接问题
    echo    2. GitHub 认证问题
    echo    3. 远程仓库权限问题
    echo.
    echo 尝试手动推送：
    echo    git push -u origin main
    echo.
)

pause

