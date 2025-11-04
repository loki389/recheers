@echo off
chcp 65001 >nul
echo ========================================
echo Git PATH 配置脚本
echo ========================================
echo.

REM 查找 Git 安装路径
set "GIT_PATH1=C:\Program Files\Git\cmd"
set "GIT_PATH2=C:\Program Files (x86)\Git\cmd"

set "GIT_PATH="

if exist "%GIT_PATH1%\git.exe" (
    set "GIT_PATH=%GIT_PATH1%"
    echo [找到] Git 在: %GIT_PATH1%
) else if exist "%GIT_PATH2%\git.exe" (
    set "GIT_PATH=%GIT_PATH2%"
    echo [找到] Git 在: %GIT_PATH2%
)

if "%GIT_PATH%"=="" (
    echo [错误] 未找到 Git 安装路径
    echo.
    echo 请手动查找 Git 安装位置：
    echo 1. 打开"开始"菜单，搜索 "Git Bash" 或 "Git CMD"
    echo 2. 右键点击，选择"打开文件位置"
    echo 3. 导航到 cmd 文件夹，复制路径
    echo.
    set /p MANUAL_PATH="或者输入 Git 的 cmd 目录完整路径: "
    if exist "%MANUAL_PATH%\git.exe" (
        set "GIT_PATH=%MANUAL_PATH%"
    ) else (
        echo [错误] 路径无效
        pause
        exit /b 1
    )
)

echo.
echo [信息] 准备添加 Git 到用户 PATH 环境变量
echo Git 路径: %GIT_PATH%
echo.

REM 使用 PowerShell 添加 PATH（更可靠）
powershell -Command "$gitPath = '%GIT_PATH%'; $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User'); $pathParts = $currentPath -split ';'; $hasGit = $false; foreach ($part in $pathParts) { if ($part -eq $gitPath) { $hasGit = $true; break } }; if (-not $hasGit) { $newPath = $currentPath; if ($newPath) { $newPath += ';' + $gitPath } else { $newPath = $gitPath }; [Environment]::SetEnvironmentVariable('Path', $newPath, 'User'); Write-Host '[成功] 已将 Git 添加到用户 PATH' -ForegroundColor Green } else { Write-Host '[信息] Git 已在用户 PATH 中' -ForegroundColor Yellow }"

echo.
echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 下一步：
echo 1. 关闭当前终端窗口
echo 2. 重新打开 PowerShell 或 CMD
echo 3. 执行 'git --version' 验证是否成功
echo.
pause

