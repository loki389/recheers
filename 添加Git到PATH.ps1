# Add Git to PATH Environment Variable
# 添加 Git 到 PATH 环境变量脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git PATH Configuration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[Warning] This operation may require administrator privileges" -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator if you encounter issues" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue with current user permissions? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Find Git installation path
$gitPaths = @(
    "C:\Program Files\Git\cmd",
    "C:\Program Files (x86)\Git\cmd",
    "${env:ProgramFiles}\Git\cmd",
    "${env:ProgramFiles(x86)}\Git\cmd"
)

$gitPath = $null
foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitExe = Join-Path $path "git.exe"
        if (Test-Path $gitExe) {
            $gitPath = $path
            Write-Host "[Success] Found Git at: $gitPath" -ForegroundColor Green
            break
        }
    }
}

if (-not $gitPath) {
    Write-Host "[Error] Git installation path not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common Git installation locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\Git\cmd"
    Write-Host "  - C:\Program Files (x86)\Git\cmd"
    Write-Host ""
    $manualPath = Read-Host "Please enter Git's cmd directory full path (e.g., C:\Program Files\Git\cmd)"
    if ($manualPath -and (Test-Path $manualPath)) {
        $gitPath = $manualPath
    } else {
        Write-Host "[Error] Invalid path, exiting" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Current PATH environment variable:" -ForegroundColor Yellow
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$pathParts = $currentPath -split ";"
$hasGit = $false
foreach ($part in $pathParts) {
    if ($part -eq $gitPath) {
        $hasGit = $true
        break
    }
}

if ($hasGit) {
    Write-Host "[Info] Git already exists in user PATH" -ForegroundColor Green
} else {
    Write-Host "[Info] Git is not in user PATH" -ForegroundColor Yellow
}

# Add to user PATH
if (-not $hasGit) {
    try {
        $newPath = $currentPath
        if ($newPath) {
            $newPath += ";$gitPath"
        } else {
            $newPath = $gitPath
        }
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "[Success] Added Git to user PATH" -ForegroundColor Green
        Write-Host "[Note] Please restart PowerShell/CMD or reopen terminal for changes to take effect" -ForegroundColor Yellow
    } catch {
        Write-Host "[Error] Failed to add PATH: $_" -ForegroundColor Red
        Write-Host "[Note] Try running this script as Administrator" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close current terminal window" -ForegroundColor White
Write-Host "2. Reopen PowerShell or CMD" -ForegroundColor White
Write-Host "3. Run 'git --version' to verify" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
