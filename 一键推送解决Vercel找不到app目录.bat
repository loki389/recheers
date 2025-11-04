@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo 一键修复：Vercel 找不到 app 目录
echo ========================================
echo.
echo 问题：Couldn't find any `pages` or `app` directory
echo 原因：代码没有推送到 GitHub
echo.
echo 正在修复...
echo.

REM Step 1: 检查 app 目录
echo [1/7] 检查本地 app 目录...
if exist app\page.tsx (
    echo    ✓ app\page.tsx 存在
) else (
    echo    ✗ ERROR: app\page.tsx 不存在！
    pause
    exit /b 1
)
if exist app\layout.tsx (
    echo    ✓ app\layout.tsx 存在
) else (
    echo    ✗ ERROR: app\layout.tsx 不存在！
    pause
    exit /b 1
)
echo.

REM Step 2: 配置 Git 路径
echo [2/7] 配置 Git 路径...
set GIT_PATH=

REM 检查常见 Git 安装路径
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_PATH=C:\Program Files\Git\bin\git.exe"
    echo    ✓ 找到 Git: Program Files
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "GIT_PATH=C:\Program Files (x86)\Git\bin\git.exe"
    echo    ✓ 找到 Git: Program Files (x86)
) else if exist "C:\Program Files\Git\cmd\git.exe" (
    set "GIT_PATH=C:\Program Files\Git\cmd\git.exe"
    echo    ✓ 找到 Git: cmd
) else (
    REM 尝试使用 PATH 中的 Git
    where git >nul 2>&1
    if %errorlevel% == 0 (
        set "GIT_PATH=git"
        echo    ✓ 在 PATH 中找到 Git
    ) else (
        echo    ✗ ERROR: 未找到 Git！
        echo.
        echo    解决方案：
        echo    1. 确保已安装 Git
        echo    2. 或运行：临时使用Git.bat
        echo    3. 或手动添加 Git 到 PATH
        pause
        exit /b 1
    )
)
echo.

REM Step 3: 验证 Git 可用
echo [3/7] 验证 Git...
"%GIT_PATH%" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo    ✗ ERROR: Git 无法使用
    pause
    exit /b 1
)
"%GIT_PATH%" --version
echo.

REM Step 4: 检查 .gitignore
echo [4/7] 检查 .gitignore...
if exist .gitignore (
    findstr /C:"^app" .gitignore >nul 2>&1
    if %errorlevel% == 0 (
        echo    ⚠ 警告: .gitignore 可能忽略了 app 目录
        echo    检查内容...
        findstr /C:"app" .gitignore
        echo    如果 app 被忽略，需要移除该行
    ) else (
        echo    ✓ .gitignore 未忽略 app 目录
    )
) else (
    echo    ✓ .gitignore 不存在（没问题）
)
echo.

REM Step 5: 添加所有文件
echo [5/7] 添加所有文件到 Git...
"%GIT_PATH%" add app\
"%GIT_PATH%" add components\
"%GIT_PATH%" add lib\
"%GIT_PATH%" add data\
"%GIT_PATH%" add types\
"%GIT_PATH%" add *.json *.ts *.tsx *.mjs *.js 2>nul
"%GIT_PATH%" add .gitignore .gitattributes vercel.json 2>nul
"%GIT_PATH%" add . 2>nul
if %errorlevel% neq 0 (
    echo    ⚠ 部分文件可能已添加
)
echo    ✓ 文件已添加
echo.

REM Step 6: 检查状态
echo [6/7] 检查将要提交的文件...
"%GIT_PATH%" status --short | findstr /C:"app\" >nul
if %errorlevel% == 0 (
    echo    ✓ app 目录包含在提交中
    "%GIT_PATH%" status --short | findstr /C:"app\"
) else (
    echo    ⚠ 检查 app 是否已在 Git 中...
    "%GIT_PATH%" ls-files app\ >nul 2>&1
    if %errorlevel% == 0 (
        echo    ✓ app 目录已在 Git 中
    ) else (
        echo    ✗ 警告: app 目录可能未被追踪
        echo    尝试强制添加...
        "%GIT_PATH%" add -f app\
    )
)
echo.

REM Step 7: 提交
echo [7/7] 提交更改...
"%GIT_PATH%" commit -m "Deploy: Push app directory and all files for Vercel" 2>nul
if %errorlevel% == 0 (
    echo    ✓ 更改已提交
) else (
    echo    ⚠ 可能没有新更改需要提交
    "%GIT_PATH%" status --short
)
echo.

REM Step 8: 推送到 GitHub
echo ========================================
echo 准备推送到 GitHub
echo ========================================
echo.
echo ⚠ 重要提示：
echo   如果提示输入密码，请使用 Personal Access Token
echo   获取 Token: https://github.com/settings/tokens
echo.
echo   使用方式：
echo   1. Username: 你的 GitHub 用户名
echo   2. Password: 粘贴你的 Personal Access Token
echo.
pause

echo.
echo 正在推送到 GitHub...
"%GIT_PATH%" push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo ✓ SUCCESS！代码已推送到 GitHub
    echo ========================================
    echo.
    echo ✅ 已完成：
    echo   1. 本地 app 目录验证通过
    echo   2. 所有文件已添加到 Git
    echo   3. 代码已推送到 GitHub
    echo.
    echo 📋 下一步操作：
    echo.
    echo [1] 验证 GitHub（必须）：
    echo     - 访问: https://github.com/loki389/recheers
    echo     - 确认能看到 app/ 目录
    echo     - 点击 app/ 目录
    echo     - 确认能看到 page.tsx 和 layout.tsx
    echo.
    echo [2] 等待 Vercel 自动部署：
    echo     - Vercel 会在 1-2 分钟内自动检测并部署
    echo     - 查看: https://vercel.com/dashboard
    echo.
    echo [3] 或手动触发部署：
    echo     - Vercel Dashboard
    echo     - Deployments → 最新部署 → Redeploy
    echo.
    echo [4] 检查部署状态：
    echo     - 应该不再显示 "找不到 app 目录" 错误
    echo     - 构建应该成功完成
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ ERROR: 推送失败
    echo ========================================
    echo.
    echo 可能的原因和解决方案：
    echo.
    echo 1. 认证失败
    echo    解决：使用 Personal Access Token 作为密码
    echo    获取：https://github.com/settings/tokens
    echo.
    echo 2. 网络问题
    echo    解决：检查网络连接，稍后重试
    echo.
    echo 3. 远程仓库未配置
    echo    解决：检查 git remote -v
    echo    或运行：git remote add origin https://github.com/loki389/recheers.git
    echo.
    echo 4. 分支名称不匹配
    echo    解决：检查分支名称
    echo    当前分支：git branch
    echo    可能需要：git push -u origin master（如果主分支是 master）
    echo.
)

pause




