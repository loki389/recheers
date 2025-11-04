@echo off
chcp 65001 >nul
echo ========================================
echo Vercel 部署修复工具
echo ========================================
echo.
echo 正在检查 Git 状态...
echo.

REM 检查 app 目录是否在 Git 中
echo [1/4] 检查 app 目录是否被 Git 跟踪...
git ls-files app/ >nul 2>&1
if %errorlevel% == 0 (
    echo    [✓] app 目录已在 Git 中
) else (
    echo    [!] app 目录未在 Git 中，需要添加
)
echo.

REM 检查未跟踪的文件
echo [2/4] 检查未跟踪的文件...
git status --short | findstr /V "^.gitignore" >nul
if %errorlevel% == 0 (
    echo    [!] 发现未跟踪的文件，需要添加到 Git
) else (
    echo    [✓] 没有未跟踪的文件
)
echo.

REM 添加所有文件
echo [3/4] 添加所有文件到 Git...
git add .
if %errorlevel% == 0 (
    echo    [✓] 文件已添加到暂存区
) else (
    echo    [✗] 添加文件失败
    pause
    exit /b 1
)
echo.

REM 检查是否有更改需要提交
git diff --cached --quiet
if %errorlevel% == 0 (
    echo    [信息] 没有需要提交的更改
) else (
    echo    [4/4] 提交更改...
    git commit -m "修复：添加所有项目文件到 Git，修复 Vercel 部署"
    if %errorlevel% == 0 (
        echo    [✓] 提交成功
        echo.
        echo [推送] 正在推送到 GitHub...
        git push
        if %errorlevel% == 0 (
            echo    [✓] 推送成功！
            echo.
            echo ========================================
            echo ✅ 修复完成！
            echo ========================================
            echo.
            echo 📝 下一步：
            echo    1. 在 GitHub 上确认能看到 app/ 目录
            echo    2. 在 Vercel Dashboard 中点击 Redeploy
            echo    3. 等待部署完成
            echo.
        ) else (
            echo    [✗] 推送失败，请检查网络连接和 Git 配置
        )
    ) else (
        echo    [✗] 提交失败
    )
)

echo.
echo ========================================
pause

