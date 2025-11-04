@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 🔧 一键修复 Vercel 部署
echo ========================================
echo.
echo 当前目录: %CD%
echo.

REM 检查是否是 Git 仓库
if not exist .git (
    echo [1/5] 初始化 Git 仓库...
    git init
    if %errorlevel% neq 0 (
        echo    ✗ 初始化失败，请检查 Git 是否已安装
        pause
        exit /b 1
    )
    echo    ✓ Git 仓库已初始化
    echo.
    
    echo [2/5] 配置 Git 用户信息...
    git config user.name "loki389"
    git config user.email "loki82576@gmail.com"
    echo    ✓ 用户信息已配置
    echo.
) else (
    echo [信息] Git 仓库已存在
    echo.
)

REM 检查远程仓库
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [3/5] 配置远程仓库...
    git remote add origin https://github.com/loki389/recheers.git
    git branch -M main
    echo    ✓ 远程仓库已配置
    echo.
) else (
    echo [信息] 远程仓库已配置
    echo.
)

echo [4/5] 添加所有文件...
git add .
if %errorlevel% == 0 (
    echo    ✓ 文件已添加
) else (
    echo    ✗ 添加文件失败
    pause
    exit /b 1
)
echo.

echo [5/5] 提交并推送...
git commit -m "修复：HistoryTimeline TypeScript 类型错误和 Vercel 配置"
if %errorlevel% == 0 (
    echo    ✓ 提交成功
) else (
    echo    [信息] 没有需要提交的更改
)
echo.

git push -u origin main
if %errorlevel% == 0 (
    echo    ✓ 推送成功！
    echo.
    echo ========================================
    echo ✅ 修复完成！
    echo ========================================
    echo.
    echo 📝 下一步：
    echo    1. Vercel 会自动检测推送并重新部署
    echo    2. 或在 Vercel Dashboard 中手动点击 Redeploy
    echo    3. 等待部署完成（通常 2-3 分钟）
    echo.
) else (
    echo    ✗ 推送失败
    echo.
    echo [提示] 可能的原因：
    echo    - 网络连接问题
    echo    - GitHub 认证问题（可能需要输入用户名和密码）
    echo    - 远程仓库权限问题
    echo.
)

pause




