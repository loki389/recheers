# 查找 Git 安装路径脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "正在查找 Git 安装路径..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$searchPaths = @(
    "C:\Program Files\Git",
    "C:\Program Files (x86)\Git",
    "$env:ProgramFiles\Git",
    "${env:ProgramFiles(x86)}\Git",
    "$env:LOCALAPPDATA\GitHub",
    "$env:ProgramFiles\GitHub",
    "C:\Users\$env:USERNAME\AppData\Local\GitHub"
)

$foundPaths = @()

foreach ($searchPath in $searchPaths) {
    if (Test-Path $searchPath) {
        $cmdPath = Join-Path $searchPath "cmd"
        $gitExe = Join-Path $cmdPath "git.exe"
        
        if (Test-Path $gitExe) {
            $foundPaths += $cmdPath
            Write-Host "[找到] $cmdPath" -ForegroundColor Green
        }
        
        # 也检查 bin 目录（某些安装可能只有 bin）
        $binPath = Join-Path $searchPath "bin"
        $gitExeBin = Join-Path $binPath "git.exe"
        if (Test-Path $gitExeBin) {
            $foundPaths += $binPath
            Write-Host "[找到] $binPath" -ForegroundColor Green
        }
    }
}

# 通过快捷方式查找
Write-Host ""
Write-Host "正在检查快捷方式..." -ForegroundColor Yellow
$shortcuts = @(
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Git",
    "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Git"
)

foreach ($shortcutPath in $shortcuts) {
    if (Test-Path $shortcutPath) {
        $lnkFiles = Get-ChildItem $shortcutPath -Filter "*.lnk" -ErrorAction SilentlyContinue
        foreach ($lnk in $lnkFiles) {
            Write-Host "[发现] 快捷方式: $($lnk.Name)" -ForegroundColor Cyan
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($foundPaths.Count -eq 0) {
    Write-Host "[未找到] 未能在常见位置找到 Git" -ForegroundColor Red
    Write-Host ""
    Write-Host "请手动查找：" -ForegroundColor Yellow
    Write-Host "1. 打开开始菜单，搜索 'Git Bash' 或 'Git CMD'" -ForegroundColor White
    Write-Host "2. 右键点击，选择 '打开文件位置'" -ForegroundColor White
    Write-Host "3. 在文件资源管理器中，导航到 'cmd' 文件夹" -ForegroundColor White
    Write-Host "4. 复制该文件夹的完整路径" -ForegroundColor White
    Write-Host ""
    Write-Host "常见路径格式：" -ForegroundColor Yellow
    Write-Host "  C:\Program Files\Git\cmd" -ForegroundColor White
    Write-Host "  C:\Program Files (x86)\Git\cmd" -ForegroundColor White
} else {
    Write-Host "[成功] 找到 $($foundPaths.Count) 个可能的 Git 路径：" -ForegroundColor Green
    Write-Host ""
    for ($i = 0; $i -lt $foundPaths.Count; $i++) {
        Write-Host "  $($i+1). $($foundPaths[$i])" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "请复制上面的路径之一，然后在添加 PATH 脚本中使用" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "按 Enter 键退出"

