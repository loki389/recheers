# 开发服务器监控脚本
# 自动检测服务器状态，出现问题自动重启

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开发服务器监控" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$checkInterval = 10  # 每10秒检查一次
$maxRetries = 3      # 最大重试次数
$retryCount = 0

function Test-Server {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Restart-Server {
    Write-Host "[重启] 检测到服务器无响应，正在重启..." -ForegroundColor Yellow
    
    # 停止 Node 进程
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Start-Sleep -Seconds 2
    
    # 清理缓存
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
    
    # 启动服务器
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
    
    Start-Sleep -Seconds 15
    
    if (Test-Server) {
        Write-Host "[成功] 服务器已重新启动并响应" -ForegroundColor Green
        $script:retryCount = 0
        return $true
    } else {
        $script:retryCount++
        Write-Host "[失败] 重启失败 (尝试 $retryCount/$maxRetries)" -ForegroundColor Red
        return $false
    }
}

Write-Host "监控已启动，每 $checkInterval 秒检查一次服务器状态" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止监控" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    if (-not (Test-Server)) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 服务器无响应" -ForegroundColor Red
        
        if ($retryCount -lt $maxRetries) {
            if (-not (Restart-Server)) {
                Write-Host "[警告] 已达到最大重试次数，请手动检查" -ForegroundColor Red
                break
            }
        } else {
            Write-Host "[错误] 多次重启失败，请手动检查问题" -ForegroundColor Red
            break
        }
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 服务器正常响应 ✓" -ForegroundColor Green
        $retryCount = 0
    }
    
    Start-Sleep -Seconds $checkInterval
}

