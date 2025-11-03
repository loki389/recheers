@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 🚀 立即修复 Vercel 部署
echo ========================================
echo.
echo 当前目录: %CD%
echo.

REM 检查是否是 Git 仓库
if not exist .git (
    echo [错误] 当前目录不是 Git 仓库！
    echo.
    echo 请先运行：初始化Git并推送.bat
    echo.
    pause
    exit /b 1
)

echo [1/3] 添加修复的文件...
git add components/HistoryTimeline.tsx app/page.tsx vercel.json types/common.ts
if %errorlevel% == 0 (
    echo    ✓ 文件已添加
) else (
    echo    ✗ 添加失败
    pause
    exit /b 1
)
echo.

echo [2/3] 提交更改...
git commit -m "修复：HistoryTimeline TypeScript 类型错误和 Vercel 配置"
if %errorlevel% == 0 (
    echo    ✓ 提交成功
) else (
    echo    ✗ 提交失败
    pause
    exit /b 1
)
echo.

echo [3/3] 推送到 GitHub...
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
    echo    ✗ 推送失败，请检查：
    echo      - 网络连接
    echo      - Git 远程仓库配置
    echo      - GitHub 访问权限
    echo.
)

pause

