@echo off
chcp 65001 >nul
echo ========================================
echo 智能重启开发服务器
echo ========================================
echo.

REM 第一步：检查端口占用
echo [1/5] 检查端口 3000 状态...
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% == 0 (
    echo    端口 3000 被占用，将清理进程
) else (
    echo    端口 3000 空闲
)
echo.

REM 第二步：停止所有 Node 进程
echo [2/5] 正在停止所有 Node 进程...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo    Node 进程已停止
) else (
    echo    没有运行中的 Node 进程
)
timeout /t 2 /nobreak >nul
echo.

REM 第三步：清理缓存
echo [3/5] 正在清理构建缓存...
if exist .next (
    rmdir /s /q .next
    echo    .next 目录已清除
) else (
    echo    .next 目录不存在
)
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo    node_modules/.cache 已清除
)
if exist tsconfig.tsbuildinfo (
    del /f /q tsconfig.tsbuildinfo
    echo    tsconfig.tsbuildinfo 已清除
)
echo.

REM 第四步：快速编译检查
echo [4/5] 执行快速编译检查...
call npm run build >nul 2>&1
if %errorlevel% == 0 (
    echo    编译检查通过 ✓
) else (
    echo    警告：编译检查失败，但将继续启动开发服务器
    echo    请在浏览器中查看具体错误信息
)
echo.

REM 第五步：启动开发服务器
echo [5/5] 正在启动开发服务器...
echo.
echo ========================================
echo ✅ 服务器正在启动，请等待编译完成
echo 📍 访问地址: http://localhost:3000
echo.
echo 💡 提示:
echo    - 等待 15-20 秒让服务器完成编译
echo    - 按 Ctrl+C 可以停止服务器
echo    - 如果页面空白，按 Ctrl+F5 强制刷新
echo ========================================
echo.

call npm run dev

