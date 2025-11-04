# Git 配置脚本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git 配置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
try {
    $null = Get-Command git -ErrorAction Stop
    Write-Host "[成功] 检测到 Git 已安装" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Git！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Git：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://git-scm.com/download/win"
    Write-Host "2. 下载并安装 Git for Windows"
    Write-Host "3. 安装时选择 'Add Git to PATH' 选项"
    Write-Host "4. 安装完成后重新运行此脚本"
    Write-Host ""
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "当前 Git 配置：" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
$currentName = git config --global user.name 2>$null
$currentEmail = git config --global user.email 2>$null
Write-Host "用户名: $currentName" -ForegroundColor Cyan
Write-Host "邮箱: $currentEmail" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# 询问用户信息
$username = Read-Host "请输入您的用户名（直接回车保持当前配置）"
$useremail = Read-Host "请输入您的邮箱（直接回车保持当前配置）"

# 设置用户名
if ($username -ne "") {
    git config --global user.name $username
    Write-Host "[成功] 用户名已设置为: $username" -ForegroundColor Green
} else {
    Write-Host "[跳过] 保持当前用户名配置" -ForegroundColor Yellow
}

# 设置邮箱
if ($useremail -ne "") {
    git config --global user.email $useremail
    Write-Host "[成功] 邮箱已设置为: $useremail" -ForegroundColor Green
} else {
    Write-Host "[跳过] 保持当前邮箱配置" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置完成！当前配置：" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$finalName = git config --global user.name
$finalEmail = git config --global user.email
Write-Host "用户名: $finalName" -ForegroundColor Green
Write-Host "邮箱: $finalEmail" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 询问是否初始化仓库
$initRepo = Read-Host "是否在当前目录初始化 Git 仓库？(y/n)"
if ($initRepo -eq "y" -or $initRepo -eq "Y") {
    if (Test-Path ".git") {
        Write-Host "[信息] 当前目录已经是 Git 仓库" -ForegroundColor Yellow
    } else {
        git init
        Write-Host "[成功] Git 仓库初始化完成" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "配置完成！" -ForegroundColor Green
Read-Host "按 Enter 键退出"

