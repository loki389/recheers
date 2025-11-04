# Git 提交检查清单

## ⚠️ 重要：Vercel 部署前必须检查

### 确保以下目录和文件已提交到 Git：

```
✅ app/
   ✅ app/page.tsx
   ✅ app/layout.tsx
   ✅ app/globals.css
   ✅ app/api/

✅ components/

✅ lib/

✅ data/
   ✅ data/history.md
   ✅ data/survey.json

✅ types/

✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ next.config.ts
✅ tailwind.config.ts
✅ postcss.config.mjs
✅ vercel.json
✅ .gitignore
```

### 检查步骤：

1. **在项目根目录运行**：
   ```bash
   git status
   ```

2. **如果 `app/` 目录显示为未跟踪（untracked）**：
   ```bash
   git add app/
   git add components/
   git add lib/
   git add data/
   git add types/
   git add *.json *.ts *.tsx *.mjs .gitignore vercel.json
   git commit -m "添加所有项目文件"
   git push
   ```

3. **验证文件已提交**：
   ```bash
   git ls-files | grep "^app/"
   ```
   应该看到 `app/page.tsx` 等文件

### 常见问题：

**问题**: Vercel 提示"找不到任何页面或应用程序目录"

**原因**: `app/` 目录没有被 Git 追踪

**解决**: 
1. 检查 `.gitignore` 是否错误地忽略了 `app/`
2. 确保运行了 `git add app/`
3. 确保运行了 `git commit` 和 `git push`

### 快速修复命令：

```bash
# 确保所有必要文件都已添加
git add .

# 检查是否有被忽略的重要文件
git status --ignored

# 提交并推送
git commit -m "准备部署到 Vercel"
git push
```


