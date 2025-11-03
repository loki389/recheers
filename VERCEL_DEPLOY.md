# Vercel 部署指南

## 常见部署问题及解决方案

### 1. 环境变量未配置

**问题**: API 功能无法正常工作

**解决**: 在 Vercel 项目设置中添加环境变量
- 进入项目设置 > Environment Variables
- 添加 `OPENAI_API_KEY`，值为你的 DeepSeek API 密钥

### 2. 构建失败 - Node.js 版本

**问题**: 构建时出现版本错误

**解决**: 在 `package.json` 中指定 Node.js 版本：

```json
"engines": {
  "node": ">=18.0.0"
}
```

### 3. 构建失败 - 文件系统访问

**问题**: `lib/history.ts` 使用 `fs.readFileSync` 读取文件

**解决**: 
- 确保 `data/` 目录中的文件已提交到 Git
- 文件会在构建时被包含到部署包中
- 检查 `.gitignore` 确保 `data/` 目录没有被忽略

### 4. 构建失败 - 依赖安装问题

**问题**: `pnpm` 命令失败或依赖安装超时

**解决**: 
- Vercel 默认使用 npm，已更新 `vercel.json` 使用 npm
- 如果仍有问题，可以删除 `vercel.json`，让 Vercel 自动检测

### 5. API 路由错误 500

**问题**: 部署后 API 返回 500 错误

**解决**:
- 检查环境变量是否已正确配置
- 查看 Vercel 函数日志中的具体错误
- 确保所有 API 路由都使用 `export const runtime = "nodejs"`

### 6. 运行时错误

**问题**: 页面加载时出现错误

**解决**:
- 检查浏览器控制台的错误信息
- 查看 Vercel 部署日志
- 确保所有依赖都已正确安装

## 部署检查清单

- [ ] 代码已推送到 Git 仓库（GitHub/GitLab/Bitbucket）
- [ ] 环境变量 `OPENAI_API_KEY` 已在 Vercel 中配置
- [ ] `data/` 目录中的文件已提交到 Git
- [ ] `package.json` 中的构建脚本正确
- [ ] 本地运行 `npm run build` 成功
- [ ] 没有 TypeScript 错误
- [ ] `.env.local` 文件在 `.gitignore` 中（不会上传）

## 部署步骤

1. **准备代码**
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   git push origin main
   ```

2. **连接 Vercel**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入你的 Git 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量**
   - 在项目设置中添加 `OPENAI_API_KEY`
   - 选择环境：Production, Preview, Development

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成
   - 查看部署日志，确认无错误

5. **验证部署**
   - 访问部署后的 URL
   - 测试所有功能：
     - AI 聊天功能
     - 数据可视化
     - 历史时间线

## 故障排查命令

在本地运行以下命令，确保构建成功：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 检查 TypeScript 错误
npx tsc --noEmit

# 运行生产服务器测试
npm start
```

如果本地构建失败，部署也会失败。请先修复本地问题。


