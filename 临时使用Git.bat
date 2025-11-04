@echo off
chcp 65001 >nul
echo ========================================
echo Git 临时路径配置脚本
echo ========================================
echo.
echo 此脚本会临时添加 Git 到 PATH（仅当前窗口有效）
echo.

REM 常见的 Git 安装路径
set "GIT_PATH1=C:\Program Files\Git\cmd"
set "GIT_PATH2=C:\Program Files (x86)\Git\cmd"

REM 检查路径1
if exist "%GIT_PATH1%\git.exe" (
    echo [找到] Git 在: %GIT_PATH1%
    set "PATH=%PATH%;%GIT_PATH1%"
    goto :test
)

REM 检查路径2
if exist "%GIT_PATH2%\git.exe" (
    echo [找到] Git 在: %GIT_PATH2%
    set "PATH=%PATH%;%GIT_PATH2%"
    goto :test
)

echo [错误] 未找到 Git 安装路径
echo.
echo 请手动查找 Git 安装位置：
echo 1. 打开"开始"菜单
echo 2. 搜索 "Git Bash" 或 "Git CMD"
echo 3. 右键点击，选择"打开文件位置"
echo 4. 导航到 cmd 文件夹，复制路径
echo.
set /p MANUAL_PATH="或者输入 Git 的 cmd 目录完整路径: "
if exist "%MANUAL_PATH%\git.exe" (
    set "PATH=%PATH%;%MANUAL_PATH%"
    goto :test
)

echo [错误] 路径无效
pause
exit /b 1

:test
echo.
echo [测试] 验证 Git 是否可用...
git --version
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] Git 现在可以使用了！
    echo ========================================
    echo.
    echo 注意：这只是临时配置，关闭此窗口后失效
    echo 要永久添加，请运行"添加Git到PATH.ps1"或查看"手动添加Git到PATH.md"
    echo.
    echo 现在可以执行 Git 命令，例如：
    echo   git config --global user.name "您的姓名"
    echo   git config --global user.email "your.email@example.com"
    echo.
) else (
    echo [错误] Git 仍然不可用
)
echo.
pause

