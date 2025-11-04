@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo 紧急修复：推送 app 目录到 GitHub
echo ========================================
echo.
echo 问题：Vercel 找不到 app 目录
echo 原因：代码没有推送到 GitHub
echo.
echo 正在修复...
echo.

REM Step 1: 检查 app 目录
echo [步骤 1] 检查本地 app 目录...
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

REM Step 2: 查找 Git 路径
echo [步骤 2] 查找 Git...
set GIT_PATH=

REM 常见 Git 安装路径
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_PATH=C:\Program Files\Git\bin\git.exe"
    echo    找到 Git: %GIT_PATH%
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "GIT_PATH=C:\Program Files (x86)\Git\bin\git.exe"
    echo    找到 Git: %GIT_PATH%
) else (
    echo    ✗ 未找到 Git，尝试使用系统 PATH...
    where git >nul 2>&1
    if %errorlevel% == 0 (
        set "GIT_PATH=git"
        echo    ✓ 在 PATH 中找到 Git
    ) else (
        echo    ✗ ERROR: 未找到 Git！
        echo.
        echo    请安装 Git 或运行：临时使用Git.bat
        pause
        exit /b 1
    )
)
echo.

REM Step 3: 添加所有文件
echo [步骤 3] 添加所有文件到 Git...
"%GIT_PATH%" add app\
"%GIT_PATH%" add components\
"%GIT_PATH%" add lib\
"%GIT_PATH%" add data\
"%GIT_PATH%" add types\
"%GIT_PATH%" add *.json *.ts *.tsx *.mjs *.js
"%GIT_PATH%" add .gitignore .gitattributes vercel.json
if %errorlevel% neq 0 (
    echo    ✗ ERROR: 添加文件失败
    pause
    exit /b 1
)
echo    ✓ 文件已添加
echo.

REM Step 4: 检查状态
echo [步骤 4] 检查 Git 状态...
"%GIT_PATH%" status --short | findstr /C:"app\" >nul
if %errorlevel% == 0 (
    echo    ✓ app 目录在暂存区中
) else (
    echo    ⚠ 警告: app 目录可能已在提交中
)
echo.

REM Step 5: 提交
echo [步骤 5] 提交更改...
"%GIT_PATH%" commit -m "Fix: Push app directory for Vercel deployment"
if %errorlevel% == 0 (
    echo    ✓ 更改已提交
) else (
    echo    ⚠ 可能没有新更改需要提交
)
echo.

REM Step 6: 推送到 GitHub
echo [步骤 6] 推送到 GitHub...
echo.
echo    ⚠ 注意：如果提示输入密码，请使用 Personal Access Token
echo    获取 Token: https://github.com/settings/tokens
echo.
pause

"%GIT_PATH%" push -u origin main
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo ✓ SUCCESS！代码已推送到 GitHub
    echo ========================================
    echo.
    echo 下一步：
    echo   1. 访问 https://github.com/loki389/recheers
    echo   2. 确认能看到 app/ 目录
    echo   3. 进入 app/ 目录，确认能看到 page.tsx 和 layout.tsx
    echo   4. 等待 1-2 分钟，Vercel 会自动重新部署
    echo   5. 或在 Vercel Dashboard 手动触发：Deployments → Redeploy
    echo.
    echo 如果 GitHub 上还是看不到 app/ 目录：
    echo   - 检查 .gitignore 是否忽略了 app/
    echo   - 运行：git check-ignore -v app/
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ ERROR: 推送失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. 认证失败 - 需要使用 Personal Access Token
    echo   2. 网络问题 - 检查网络连接
    echo   3. 远程仓库未配置
    echo.
    echo 解决方案：
    echo   1. 查看错误信息
    echo   2. 如果提示认证，使用 Personal Access Token 作为密码
    echo   3. 检查远程仓库：git remote -v
    echo.
)

pause




