# 在 D 盘查找 Git 安装路径
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "正在 D 盘查找 Git..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$dDrivePaths = @(
    "D:\Program Files\Git",
    "D:\Program Files (x86)\Git",
    "D:\Git",
    "D:\Tools\Git",
    "D:\Software\Git",
    "D:\Apps\Git"
)

$foundPaths = @()

# 检查常见路径
foreach ($path in $dDrivePaths) {
    if (Test-Path $path) {
        $cmdPath = Join-Path $path "cmd"
        $binPath = Join-Path $path "bin"
        $gitExeCmd = Join-Path $cmdPath "git.exe"
        $gitExeBin = Join-Path $binPath "git.exe"
        
        if (Test-Path $gitExeCmd) {
            $foundPaths += $cmdPath
            Write-Host "[找到] $cmdPath" -ForegroundColor Green
        }
        if (Test-Path $gitExeBin) {
            $foundPaths += $binPath
            Write-Host "[找到] $binPath" -ForegroundColor Green
        }
    }
}

# 如果在常见路径没找到，搜索整个 D 盘（但限制深度避免太慢）
if ($foundPaths.Count -eq 0) {
    Write-Host ""
    Write-Host "在常见路径未找到，正在搜索 D 盘..." -ForegroundColor Yellow
    Write-Host "（这可能需要一些时间）" -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $gitExes = Get-ChildItem "D:\" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue -Depth 4 | Select-Object -First 5
        foreach ($gitExe in $gitExes) {
            $parentDir = $gitExe.DirectoryName
            if ($parentDir -like "*\cmd" -or $parentDir -like "*\bin") {
                Write-Host "[找到] $parentDir" -ForegroundColor Green
                if (-not ($foundPaths -contains $parentDir)) {
                    $foundPaths += $parentDir
                }
            }
        }
    } catch {
        Write-Host "[警告] 搜索遇到错误: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($foundPaths.Count -eq 0) {
    Write-Host "[未找到] 未能在 D 盘找到 Git" -ForegroundColor Red
    Write-Host ""
    Write-Host "请手动查找：" -ForegroundColor Yellow
    Write-Host "1. 打开文件资源管理器，进入 D 盘" -ForegroundColor White
    Write-Host "2. 搜索 'git.exe' 文件" -ForegroundColor White
    Write-Host "3. 找到后，查看它所在的文件夹" -ForegroundColor White
    Write-Host "   - 如果在 'cmd' 文件夹中，使用该文件夹路径" -ForegroundColor White
    Write-Host "   - 如果在 'bin' 文件夹中，通常应该使用 'cmd' 文件夹路径" -ForegroundColor White
    Write-Host ""
    Write-Host "或者告诉我 Git 安装在 D 盘的哪个文件夹，我可以帮您找到正确路径" -ForegroundColor Yellow
} else {
    Write-Host "[成功] 找到 $($foundPaths.Count) 个可能的 Git 路径：" -ForegroundColor Green
    Write-Host ""
    for ($i = 0; $i -lt $foundPaths.Count; $i++) {
        Write-Host "  $($i+1). $($foundPaths[$i])" -ForegroundColor Cyan
    }
    Write-Host ""
    if ($foundPaths.Count -eq 1) {
        Write-Host "推荐使用路径: $($foundPaths[0])" -ForegroundColor Green
    } else {
        Write-Host "通常应该使用包含 'cmd' 的路径" -ForegroundColor Yellow
    }
}

Write-Host ""
Read-Host "按 Enter 键退出"

