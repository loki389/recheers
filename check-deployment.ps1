# Check deployment readiness

Write-Host "=== Checking Deployment Readiness ===" -ForegroundColor Green
Write-Host ""

# Check app directory
Write-Host "1. Checking app directory..." -ForegroundColor Yellow
if (Test-Path "app") {
    Write-Host "   [OK] app directory exists" -ForegroundColor Green
    if (Test-Path "app\page.tsx") {
        Write-Host "   [OK] app/page.tsx exists" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] app/page.tsx missing!" -ForegroundColor Red
    }
    if (Test-Path "app\layout.tsx") {
        Write-Host "   [OK] app/layout.tsx exists" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] app/layout.tsx missing!" -ForegroundColor Red
    }
} else {
    Write-Host "   [ERROR] app directory missing!" -ForegroundColor Red
}

Write-Host ""

# Check config files
Write-Host "2. Checking config files..." -ForegroundColor Yellow
$configFiles = @("package.json", "next.config.ts", "tsconfig.json")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "   [OK] $file exists" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] $file missing!" -ForegroundColor Red
    }
}

Write-Host ""

# Check Git status
Write-Host "3. Checking Git status..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   [OK] Git repository initialized" -ForegroundColor Green
    
    $gitInstalled = $false
    try {
        $null = Get-Command git -ErrorAction Stop
        $gitInstalled = $true
    } catch {
        Write-Host "   [WARN] Git command not available" -ForegroundColor Yellow
    }
    
    if ($gitInstalled) {
        Write-Host "   Checking tracked files..." -ForegroundColor Cyan
        $gitStatus = git status --short 2>$null
        if ($gitStatus) {
            Write-Host "   Untracked/modified files:" -ForegroundColor Yellow
            $gitStatus | Select-Object -First 10 | ForEach-Object {
                Write-Host "     $_" -ForegroundColor Cyan
            }
        }
        
        $appFiles = git ls-files app/ 2>$null
        if ($appFiles) {
            Write-Host "   [OK] app directory files are in Git:" -ForegroundColor Green
            $appFiles | Select-Object -First 5 | ForEach-Object {
                Write-Host "     $_" -ForegroundColor Cyan
            }
        } else {
            Write-Host "   [ERROR] app directory files NOT in Git!" -ForegroundColor Red
            Write-Host "   Run: git add app/" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   [WARN] Git repository not initialized" -ForegroundColor Yellow
    Write-Host "   Run: git init" -ForegroundColor Cyan
}

Write-Host ""

# Check key files
Write-Host "4. Key files list..." -ForegroundColor Yellow
$keyFiles = @(
    "app\page.tsx",
    "app\layout.tsx",
    "app\globals.css",
    "app\api\chat\route.ts",
    "app\api\metrics\route.ts",
    "app\api\history\route.ts",
    "package.json",
    "next.config.ts"
)

$allExist = $true
foreach ($file in $keyFiles) {
    if (Test-Path $file) {
        Write-Host "   [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] $file (missing)" -ForegroundColor Red
        $allExist = $false
    }
}

Write-Host ""
Write-Host "=== Check Complete ===" -ForegroundColor Green

if ($allExist) {
    Write-Host ""
    Write-Host "[OK] All key files exist!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Ensure all files are committed to Git" -ForegroundColor Cyan
    Write-Host "2. Push to GitHub/GitLab/Bitbucket" -ForegroundColor Cyan
    Write-Host "3. Import project in Vercel" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERROR] Some files are missing, check the list above" -ForegroundColor Red
}
