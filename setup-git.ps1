# PowerShell 脚本：初始化 Git 仓库并准备 Vercel 部署

Write-Host "=== 准备 Vercel 部署 ===" -ForegroundColor Green
Write-Host ""

# 检查是否已经是 Git 仓库
if (Test-Path .git) {
    Write-Host "✓ Git 仓库已存在" -ForegroundColor Green
} else {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git 仓库已初始化" -ForegroundColor Green
}

Write-Host ""

# 检查必要文件是否存在
Write-Host "检查必要文件..." -ForegroundColor Yellow

$requiredFiles = @(
    "app/page.tsx",
    "app/layout.tsx",
    "package.json",
    "next.config.ts",
    "tsconfig.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (缺失!)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "错误：缺少必要文件！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "所有必要文件都存在 ✓" -ForegroundColor Green
Write-Host ""

# 添加所有文件到 Git
Write-Host "添加文件到 Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 显示状态
Write-Host "Git 状态：" -ForegroundColor Yellow
git status --short
Write-Host ""

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "有未提交的更改，建议执行：" -ForegroundColor Yellow
    Write-Host "  git commit -m 'Initial commit for Vercel deployment'" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "所有更改已提交 ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 下一步操作 ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. 提交更改：" -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit for Vercel deployment'" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. 在 GitHub/GitLab/Bitbucket 创建新仓库" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. 连接到远程仓库并推送：" -ForegroundColor Yellow
Write-Host "   git remote add origin <你的仓库URL>" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. 在 Vercel 中导入项目：" -ForegroundColor Yellow
Write-Host "   - 登录 https://vercel.com" -ForegroundColor Cyan
Write-Host "   - 点击 'Add New' -> 'Project'" -ForegroundColor Cyan
Write-Host "   - 选择你的 Git 仓库" -ForegroundColor Cyan
Write-Host "   - 配置环境变量 OPENAI_API_KEY" -ForegroundColor Cyan
Write-Host "   - 点击 'Deploy'" -ForegroundColor Cyan
Write-Host ""


