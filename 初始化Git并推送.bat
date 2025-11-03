@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 初始化 Git 并修复 Vercel 部署
echo ========================================
echo.

REM 检查是否已经是 Git 仓库
if exist .git (
    echo [信息] Git 仓库已存在
    goto :commit_and_push
)

echo [1/4] 初始化 Git 仓库...
git init
if %errorlevel% == 0 (
    echo    ✓ Git 仓库已初始化
) else (
    echo    ✗ 初始化失败，请检查 Git 是否已安装
    pause
    exit /b 1
)
echo.

echo [2/4] 配置 Git 用户信息（如果需要）...
git config user.name "loki389"
git config user.email "loki82576@gmail.com"
echo    ✓ 用户信息已配置
echo.

:commit_and_push
echo [3/4] 添加所有文件...
git add .
if %errorlevel% == 0 (
    echo    ✓ 文件已添加
) else (
    echo    ✗ 添加文件失败
    pause
    exit /b 1
)
echo.

echo [4/4] 提交更改...
git commit -m "修复：HistoryTimeline TypeScript 类型错误和 Vercel 配置"
if %errorlevel% == 0 (
    echo    ✓ 提交成功
) else (
    echo    [信息] 没有需要提交的更改，或已经提交过了
)
echo.

echo [检查] 检查远程仓库配置...
git remote -v >nul 2>&1
if %errorlevel% == 0 (
    git remote -v
    echo.
    echo [推送] 推送到远程仓库...
    git push
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
        echo [提示] 如果还没有设置远程仓库，请执行：
        echo    git remote add origin https://github.com/loki389/recheers.git
        echo    git branch -M main
        echo    git push -u origin main
        echo.
    )
) else (
    echo    [!] 尚未配置远程仓库
    echo.
    echo [提示] 需要先配置远程仓库：
    echo    1. 在 GitHub 上创建仓库（如果还没有）
    echo    2. 执行以下命令：
    echo.
    echo    git remote add origin https://github.com/loki389/recheers.git
    echo    git branch -M main
    echo    git push -u origin main
    echo.
)

pause

