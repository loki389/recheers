@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 🔍 诊断并修复 GitHub 推送问题
echo ========================================
echo.
echo 当前目录: %CD%
echo.

REM 步骤 1：检查 Git 仓库
echo [检查 1/6] 检查 Git 仓库...
if not exist .git (
    echo    ✗ 未找到 Git 仓库
    echo    正在初始化...
    git init
    git config user.name "loki389"
    git config user.email "loki82576@gmail.com"
    echo    ✓ Git 仓库已初始化
) else (
    echo    ✓ Git 仓库存在
)
echo.

REM 步骤 2：检查远程仓库
echo [检查 2/6] 检查远程仓库配置...
git remote -v
if %errorlevel% neq 0 (
    echo    ✗ 未配置远程仓库
    echo    正在配置...
    git remote add origin https://github.com/loki389/recheers.git
    echo    ✓ 远程仓库已配置
) else (
    echo    ✓ 远程仓库已配置
)
echo.

REM 步骤 3：检查当前分支
echo [检查 3/6] 检查当前分支...
git branch
git branch -M main
echo.

REM 步骤 4：检查未提交的更改
echo [检查 4/6] 检查未提交的更改...
git status --short
echo.
pause

REM 步骤 5：添加所有文件
echo [操作 5/6] 添加所有文件到 Git...
git add .
if %errorlevel% == 0 (
    echo    ✓ 文件已添加
) else (
    echo    ✗ 添加失败
    pause
    exit /b 1
)
echo.

REM 步骤 6：提交更改
echo [操作 6/6] 提交更改...
git commit -m "修复：HistoryTimeline TypeScript 类型错误和 Vercel 配置"
if %errorlevel% == 0 (
    echo    ✓ 提交成功
) else (
    echo    [信息] 没有需要提交的更改
)
echo.

REM 推送
echo ========================================
echo 📤 开始推送到 GitHub...
echo ========================================
echo.
echo 这将推送到: https://github.com/loki389/recheers.git
echo.
pause

git push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 📝 验证步骤：
    echo    1. 打开浏览器
    echo    2. 访问: https://github.com/loki389/recheers
    echo    3. 刷新页面（按 F5）
    echo    4. 应该能看到最新的提交
    echo    5. 检查 components/HistoryTimeline.tsx 文件是否已更新
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ 推送失败
    echo ========================================
    echo.
    echo 可能的错误和解决方案：
    echo.
    echo [错误 1] Authentication failed
    echo    解决: 需要配置 GitHub 认证
    echo    方法: 使用 GitHub Personal Access Token
    echo.
    echo [错误 2] Permission denied
    echo    解决: 检查 GitHub 仓库权限
    echo    确认: 你有推送权限
    echo.
    echo [错误 3] Connection timeout
    echo    解决: 检查网络连接
    echo    重试: 运行此脚本 again
    echo.
    echo 手动推送命令：
    echo    git push -u origin main
    echo.
)

pause

