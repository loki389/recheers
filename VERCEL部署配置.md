# Vercel 部署配置说明

## ✅ 已完成的配置

1. **vercel.json** - 已配置正确的构建命令
2. **package.json** - 已设置 Node.js 版本要求
3. **类型错误修复** - HistoryTimeline 组件类型问题已解决

## 📋 部署步骤

### 方法一：通过 GitHub（推荐）

1. **提交代码到 GitHub**
   ```bash
   git add .
   git commit -m "修复类型错误，配置 Vercel"
   git push
   ```

2. **在 Vercel 中连接仓库**
   - 访问 https://vercel.com
   - 点击 "Add New Project"
   - 导入 GitHub 仓库 `loki389/recheers`
   - Vercel 会自动检测 Next.js 配置

3. **环境变量设置**
   在 Vercel 项目设置中添加：
   - `OPENAI_API_KEY` = 您的 DeepSeek API Key

4. **部署**
   - Vercel 会自动部署
   - 等待构建完成

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel
   ```

3. **生产环境部署**
   ```bash
   vercel --prod
   ```

## 🔧 Vercel 配置详情

### vercel.json 配置
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": ".next"
}
```

### 构建要求
- Node.js 版本：>= 18.0.0
- 框架：Next.js 15
- 构建命令：`npm run build`

## ⚠️ 重要注意事项

1. **环境变量**
   - 必须在 Vercel 项目中设置 `OPENAI_API_KEY`
   - 设置路径：Project Settings → Environment Variables

2. **API 路由**
   - API 路由在 `/app/api/` 目录下
   - 确保所有 API 路由正常工作

3. **静态资源**
   - `public/` 目录中的文件会自动部署
   - Logo 在 `public/logo.jpg`

## 🐛 故障排除

### 构建失败
- 检查 TypeScript 类型错误
- 确保所有依赖已安装
- 查看 Vercel 构建日志

### API 错误
- 确认环境变量已设置
- 检查 API Key 是否有效
- 查看 Vercel 函数日志

### 页面无法加载
- 检查路由配置
- 确认组件导入正确
- 查看浏览器控制台错误

## 📝 验证部署

部署成功后：
1. 访问 Vercel 提供的 URL
2. 测试各个功能：
   - AI 聊天
   - 数据面板
   - 发展历程
   - 调研表单

