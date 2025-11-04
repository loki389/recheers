# Vercel 完整部署配置指南

## ✅ 已修复的问题

### 1. TypeScript 类型错误
- **问题**: `Argument of type 'number | undefined' is not assignable to parameter of type 'number'`
- **修复**: 
  - `components/HistoryTimeline.tsx` 中 `onSelectYear` 类型改为 `(year: number | undefined) => void`
  - 使用显式的 `if` 检查替代可选链调用
  - `app/page.tsx` 中状态类型已正确：`useState<number | undefined>(undefined)`

### 2. Vercel 配置
- **当前配置**: `vercel.json` 已优化为 Next.js 框架自动检测
- **构建命令**: `npm run build` ✓
- **输出目录**: `.next` ✓
- **Node 版本**: `>=18.0.0` (在 `package.json` 中指定) ✓

## 🚀 部署步骤

### 方法 1: 通过 Vercel Dashboard（推荐）

1. **连接到 GitHub**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择你的 GitHub 仓库 `loki389/recheers`

2. **配置项目设置**
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（项目根目录）
   - **Build Command**: `npm run build`（已自动设置）
   - **Output Directory**: `.next`（已自动设置）
   - **Install Command**: `npm install`（已自动设置）

3. **环境变量**
   在 Vercel Dashboard 的 "Environment Variables" 中添加：
   ```
   OPENAI_API_KEY=你的DeepSeek API密钥
   ```
   > ⚠️ **重要**: 不要使用 `sk-` 开头的旧 OpenAI 密钥，应该使用 DeepSeek API 密钥

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-3 分钟）

### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 📋 部署检查清单

### 部署前检查
- [x] TypeScript 编译通过 (`npm run build`)
- [x] 没有 lint 错误（只有警告，不影响部署）
- [x] `vercel.json` 配置正确
- [x] `package.json` 包含 `engines.node >= 18.0.0`
- [x] `.gitignore` 正确忽略 `.env` 文件
- [x] GitHub 仓库已推送最新代码

### Vercel 项目设置检查
- [ ] 框架检测为 Next.js
- [ ] 根目录设置为 `./`
- [ ] 构建命令为 `npm run build`
- [ ] Node.js 版本 >= 18.0.0
- [ ] 环境变量 `OPENAI_API_KEY` 已设置

### 构建日志检查
部署时，在 Vercel Dashboard 的构建日志中应该看到：
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

如果看到错误，请检查：
1. 环境变量是否正确设置
2. Node.js 版本是否 >= 18
3. 构建日志中的具体错误信息

## 🔧 常见问题排查

### 问题 1: "Cannot find any 'pages' or 'app' directory"
**原因**: Vercel 无法找到 Next.js 项目结构  
**解决**: 
- 确认项目根目录正确
- 确认 `app/` 目录存在
- 在 Vercel 设置中将 Root Directory 设为 `./`

### 问题 2: TypeScript 编译错误
**原因**: 类型检查失败  
**解决**: 
- 本地运行 `npm run build` 检查错误
- 已修复 `HistoryTimeline.tsx` 的类型错误

### 问题 3: API 路由 500 错误
**原因**: 缺少环境变量或 API 密钥无效  
**解决**: 
- 在 Vercel Dashboard 设置 `OPENAI_API_KEY`
- 确认 API 密钥格式正确
- 检查 API 密钥是否有效（账户余额等）

### 问题 4: 页面显示空白
**原因**: 客户端组件 SSR 问题  
**解决**: 
- 已使用 `React.lazy` 和 `Suspense` 处理
- 图表组件已正确延迟加载

## 📝 当前配置摘要

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### package.json 关键部分
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  }
}
```

## ✅ 验证部署

部署成功后，访问你的 Vercel URL，检查：
1. ✅ 首页正常加载
2. ✅ AI 聊天功能可用（需要有效的 API 密钥）
3. ✅ 数据可视化面板正常显示
4. ✅ 发展历程时间线可点击展开
5. ✅ 调研表单可以提交

---

**最后更新**: 已修复 TypeScript 类型错误，配置已优化，可以直接部署！

