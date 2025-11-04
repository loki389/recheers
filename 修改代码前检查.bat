@echo off
chcp 65001 >nul
echo ========================================
echo 修改代码前安全检查
echo ========================================
echo.
echo 正在检查当前开发环境状态...
echo.

REM 检查服务器是否运行
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] 开发服务器正在运行
) else (
    echo [!] 开发服务器未运行，建议先启动服务器
    echo     运行: npm run dev
    echo.
)

REM 检查是否有编译错误
echo [检查] 执行 TypeScript 类型检查...
call npx tsc --noEmit >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] TypeScript 检查通过
) else (
    echo [!] TypeScript 检查失败，修改前建议先修复错误
    echo     运行: npx tsc --noEmit
    echo.
)

REM 检查是否有未保存的更改
echo [检查] 检查 Git 状态...
git status --short >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Git 工作目录正常
    echo [!] 建议在修改前提交当前更改
) else (
    echo [✓] Git 检查完成
)

echo.
echo ========================================
echo 建议操作流程:
echo 1. 确保服务器正在运行 (npm run dev)
echo 2. 修改代码后等待自动重新编译
echo 3. 如果出现问题，运行: 智能重启服务器.bat
echo 4. 始终在浏览器中测试修改结果
echo ========================================
echo.
pause

