# Vercel 部署检查清单

## ✅ 已完成的配置

### 1. TypeScript 类型错误修复
- ✅ 修复了 `HistoryTimeline.tsx` 的类型错误
- ✅ 使用 `handleYearClick` 函数确保类型安全
- ✅ 构建测试通过（`npm run build` 成功）

### 2. Vercel 配置文件
- ✅ `vercel.json` - 已配置构建命令
- ✅ `package.json` - 已设置 Node.js 版本要求
- ✅ `.vercelignore` - 已配置忽略文件

### 3. 代码修复
- ✅ 组件类型定义正确
- ✅ 所有 API 路由正常
- ✅ 静态资源正确配置

## 📝 Vercel 部署步骤

### 步骤 1：推送到 GitHub
```bash
git add .
git commit -m "修复类型错误，优化 Vercel 配置"
git push
```

### 步骤 2：在 Vercel 中部署

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 登录您的账号

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 选择 `loki389/recheers`

3. **配置项目**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`（项目根目录）
   - Build Command: `npm run build`（已自动检测）
   - Output Directory: `.next`（已自动检测）
   - Install Command: `npm install`（已自动检测）

4. **环境变量**
   - 在 "Environment Variables" 中添加：
     - Key: `OPENAI_API_KEY`
     - Value: 您的 DeepSeek API Key
     - Environment: Production, Preview, Development（全选）

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 步骤 3：验证部署

部署成功后：
- ✅ 访问 Vercel 提供的 URL
- ✅ 测试首页加载
- ✅ 测试 AI 聊天功能
- ✅ 测试数据面板
- ✅ 测试发展历程展开/收起
- ✅ 测试调研表单提交

## 🔧 配置文件说明

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": ".next"
}
```

### package.json
- Node.js 版本要求：>= 18.0.0
- Next.js 版本：15.0.0
- 构建命令：`npm run build`

### .vercelignore
- 排除不必要的文件（.bat, .ps1, 文档等）
- 保留必要的源代码和配置文件

## ⚠️ 常见问题

### 问题 1：构建失败 - 类型错误
**解决方案**：已修复，代码中使用了类型安全的 `handleYearClick` 函数

### 问题 2：API 返回 500 错误
**解决方案**：
- 检查环境变量 `OPENAI_API_KEY` 是否正确设置
- 确认 API Key 有效且有余额

### 问题 3：页面显示空白
**解决方案**：
- 检查浏览器控制台错误
- 查看 Vercel 部署日志
- 确认所有路由正确配置

## 📊 构建验证

本地构建测试：
```bash
npm run build
```

如果显示：
```
✓ Generating static pages
✓ Finalizing page optimization
✓ Collecting build traces
```

说明构建成功，可以部署！

## 🚀 快速部署命令

```bash
# 提交代码
git add .
git commit -m "准备部署到 Vercel"
git push

# 然后去 Vercel 网站导入项目即可
```

