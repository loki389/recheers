# 🚀 Vercel 环境变量配置指南

## 📋 必需的环境变量

在 Vercel 部署时，你需要配置以下环境变量：

### 1. 必需配置的环境变量

### `OPENAI_API_KEY`

**用途**：用于调用 DeepSeek API，实现 AI 聊天功能

**配置步骤**：

1. **登录 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 使用 GitHub 账户登录

2. **选择你的项目**
   - 点击项目名称进入项目设置

3. **进入环境变量设置**
   - 点击顶部菜单栏的 **"Settings"**
   - 在左侧菜单中找到 **"Environment Variables"**
   - 点击进入

4. **添加环境变量**
   - 点击 **"Add New"** 按钮
   - 在 **"Key"** 输入框中输入：`OPENAI_API_KEY`
   - 在 **"Value"** 输入框中输入：你的 DeepSeek API 密钥（格式：`sk-xxxxxxxxxxxx`）
   - **重要**：选择应用环境（建议全部勾选）：
     - ✅ Production（生产环境）
     - ✅ Preview（预览环境）
     - ✅ Development（开发环境）

5. **保存并重新部署**
   - 点击 **"Save"** 保存
   - 如果项目已经部署，需要重新部署才能生效：
     - 进入 **"Deployments"** 页面
     - 点击最新的部署右侧的 **"..."** 菜单
     - 选择 **"Redeploy"**

---

### 2. 自动配置的环境变量（KV 存储）

**重要**：如果你需要调研问卷功能（用户提交问卷并更新数据面板），还需要配置 **Vercel KV** 数据库。

KV 的环境变量会在创建 KV 数据库并连接到项目后**自动配置**，你不需要手动添加：

- `KV_URL` - KV 数据库连接 URL（自动配置）
- `KV_REST_API_URL` - KV REST API URL（自动配置）
- `KV_REST_API_TOKEN` - KV REST API 令牌（自动配置）

**配置 KV 的步骤**：
1. 在 Vercel Dashboard 进入 **"Storage"** 页面
2. 点击 **"Create Database"** → 选择 **"KV"**
3. 创建后将 KV 数据库连接到你的项目
4. Vercel 会自动配置所有必要的环境变量

详细步骤请查看：`Vercel KV配置指南.md`

---

## 🔑 如何获取 DeepSeek API 密钥

### 步骤 1：访问 DeepSeek 平台
- 打开：https://platform.deepseek.com/
- 使用邮箱或 GitHub 账户登录/注册

### 步骤 2：创建 API 密钥
1. 登录后，点击左侧菜单的 **"API Keys"** 或 **"API密钥"**
2. 点击 **"Create API Key"** 或 **"创建密钥"**
3. 输入密钥名称（可选，如：`vercel-production`）
4. 点击 **"Create"** 或 **"创建"**
5. **立即复制密钥**（密钥只显示一次！）
   - 格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 3：充值账户（必需）
- DeepSeek 需要账户有余额才能使用
- 点击 **"Billing"** 或 **"充值"** 进行充值
- 建议先充值少量金额测试

---

## ✅ 配置检查清单

部署前确认：

### AI 聊天功能
- [ ] 已创建 DeepSeek 账户
- [ ] 已生成 API 密钥
- [ ] 账户已充值（有余额）
- [ ] 在 Vercel 中添加了 `OPENAI_API_KEY` 环境变量
- [ ] 环境变量值格式正确（以 `sk-` 开头）
- [ ] 选择了所有环境（Production、Preview、Development）
- [ ] 已保存环境变量

### 调研问卷功能（可选，如果需要）
- [ ] 已在 Vercel 创建 KV 数据库
- [ ] KV 数据库已连接到项目
- [ ] KV 环境变量已自动配置（检查 Vercel Dashboard）

### 部署
- [ ] 已重新部署项目（如果之前已部署）
- [ ] 测试了 AI 聊天功能
- [ ] 测试了调研问卷提交功能（如果配置了 KV）

---

## 🔍 验证配置

部署完成后，验证环境变量是否正确配置：

1. **测试 AI 聊天功能**
   - 访问部署的网站
   - 在主页的 AI 聊天框中输入消息
   - 如果能正常收到回复，说明配置成功 ✅

2. **检查 Vercel 日志**
   - 如果 AI 功能不工作，进入 **"Deployments"** → 点击最新的部署
   - 查看 **"Functions"** 或 **"Runtime Logs"**
   - 查找是否有 `OPENAI_API_KEY is not set` 的错误

---

## ⚠️ 常见问题

### 问题 1：AI 聊天返回错误 "OpenAI API key not configured"

**原因**：环境变量未配置或配置错误

**解决**：
1. 检查 Vercel 环境变量设置
2. 确认变量名是 `OPENAI_API_KEY`（大小写敏感）
3. 确认已重新部署
4. 检查 API 密钥格式是否正确

### 问题 2：返回 401 Unauthorized 错误

**原因**：API 密钥无效或已过期

**解决**：
1. 在 DeepSeek 平台重新生成密钥
2. 更新 Vercel 中的环境变量
3. 重新部署

### 问题 3：返回 402 Insufficient Balance 错误

**原因**：DeepSeek 账户余额不足

**解决**：
1. 登录 DeepSeek 平台
2. 检查账户余额
3. 充值后重新测试

### 问题 4：环境变量已配置但功能仍不工作

**原因**：可能需要重新部署

**解决**：
1. 进入 Vercel 项目的 **"Deployments"** 页面
2. 点击最新部署右侧的 **"..."** 菜单
3. 选择 **"Redeploy"**
4. 等待部署完成

---

## 📝 安全提示

✅ **正确做法**：
- ✅ 环境变量存储在 Vercel 中，不会暴露在代码中
- ✅ 使用不同的密钥用于开发和生产环境
- ✅ 定期轮换 API 密钥

❌ **错误做法**：
- ❌ 不要将 API 密钥提交到 Git 仓库
- ❌ 不要在代码中硬编码密钥
- ❌ 不要分享 API 密钥给他人

---

## 🎉 配置完成

配置完成后，你的网站应该能够：
- ✅ 正常使用 AI 聊天功能（如果配置了 `OPENAI_API_KEY`）
- ✅ 接收用户提交的调研问卷（如果配置了 KV）
- ✅ 实时更新数据面板（如果配置了 KV）

如果遇到其他问题，请查看：
- Vercel 部署日志
- 浏览器控制台错误（F12）
- 项目文档中的故障排除指南
- `Vercel KV配置指南.md`（如果调研功能有问题）
