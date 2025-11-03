# 🚀 Vercel 部署完整指南

## ✅ 项目状态检查

✓ 本地构建成功
✓ 所有必要文件存在
✓ 配置文件完整

## 📋 部署前准备清单

### 步骤 1：安装 Git（如果尚未安装）

**下载 Git for Windows：**
- 访问：https://git-scm.com/download/win
- 下载并安装（使用默认设置即可）

**或使用 GitHub Desktop（更简单）：**
- 访问：https://desktop.github.com/
- 下载并安装

### 步骤 2：创建 GitHub 仓库

1. 访问 https://github.com 并登录
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `jiubiechongfeng`（或任何你喜欢的名字）
   - Description: `酒别重逢 - 自调酒知识助手网站`
   - 选择 **Public** 或 **Private**
   - ⚠️ **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

### 步骤 3：上传代码到 GitHub

#### 方法 A：使用 GitHub Desktop（推荐，最简单）

1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择文件夹：`e:\LTNS`
4. 如果提示不是 Git 仓库，点击 "create a repository"
5. 在左侧填写：
   - Name: `jiubiechongfeng`
   - Description: `酒别重逢 - 自调酒知识助手网站`
6. 点击 "Publish repository"
7. 选择要发布的 GitHub 账户和仓库名
8. 点击 "Publish Repository"

#### 方法 B：使用命令行

在项目目录 `e:\LTNS\` 打开 PowerShell 或 CMD，执行：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit: 酒别重逢项目"

# 4. 连接到 GitHub 仓库（替换为你的仓库URL）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 5. 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 4：在 Vercel 部署

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账户登录（如果没有账户，先注册）

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 在 "Import Git Repository" 中找到你的仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: 选择 "Next.js"（通常自动检测）
   - Root Directory: 留空或输入 `./`
   - Build Command: `npm run build`（默认）
   - Output Directory: 留空（Next.js 自动处理）
   - Install Command: `npm install`（默认）

4. **添加环境变量** ⚠️ 非常重要！
   - 点击 "Environment Variables"
   - 添加以下变量：
     ```
     Name: OPENAI_API_KEY
     Value: sk-f9f905ee7af64dcfae123e55c3566559
     ```
   - ⚠️ 注意：这是你的 DeepSeek API 密钥
   - 选择环境：Production, Preview, Development（全部勾选）
   - 点击 "Add"

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常 2-5 分钟）

6. **部署成功**
   - 构建完成后，Vercel 会提供一个 URL，例如：`https://你的项目名.vercel.app`
   - 点击 "Visit" 查看你的网站

## 📝 验证部署

部署成功后，检查以下功能：

- [ ] 主页正常加载
- [ ] AI 聊天功能可以正常使用
- [ ] 数据可视化图表正常显示
- [ ] 历史时间线正常显示

## 🔧 如果遇到问题

### 问题 1：构建失败 - "找不到 app 目录"

**解决**：
- 确认 GitHub 仓库中有 `app/` 目录
- 在 GitHub 网页上检查仓库内容，确保能看到所有文件

### 问题 2：API 返回错误

**解决**：
- 检查环境变量 `OPENAI_API_KEY` 是否正确配置
- 确认使用的是 DeepSeek API 密钥，不是 OpenAI 的
- 检查 API 密钥是否有效（账户是否有余额）

### 问题 3：页面加载但功能不工作

**解决**：
- 打开浏览器开发者工具（F12）
- 查看 Console 标签的错误信息
- 检查 Network 标签的 API 请求状态

## 📞 需要帮助？

如果遇到问题，请提供：
1. Vercel 构建日志的完整错误信息
2. 浏览器控制台的错误信息
3. 你当前执行到的步骤

---

## 🎉 部署成功后

你的网站将在以下地址可访问：
- 生产环境：`https://你的项目名.vercel.app`
- 自定义域名：可以在 Vercel 设置中添加（可选）

每次你推送代码到 GitHub，Vercel 会自动重新部署！


