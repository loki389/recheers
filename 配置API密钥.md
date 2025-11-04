# 🔑 配置 API 密钥

## 错误信息
```
API请求失败 (500): {"error":"OpenAI API key not configured"}
```

## ✅ 解决方法

### 方法 1：创建 .env.local 文件（推荐）

1. **在项目根目录 `E:\LTNS` 创建文件**
   - 文件名：`.env.local`（注意前面的点）
   - 如果无法直接创建，先创建 `env.local`，然后重命名为 `.env.local`

2. **添加内容：**
   ```
   OPENAI_API_KEY=你的DeepSeek_API密钥
   ```

   ⚠️ **重要**：
   - 使用 DeepSeek API 密钥（不是 OpenAI 的）
   - 格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 不要用引号包裹

3. **保存文件后重启开发服务器**

---

### 方法 2：使用 PowerShell 创建（如果无法创建 .env.local）

在项目目录运行：

```powershell
cd E:\LTNS
echo "OPENAI_API_KEY=你的DeepSeek_API密钥" > .env.local
```

---

### 方法 3：手动创建步骤

1. **打开记事本或任何文本编辑器**
2. **输入：**
   ```
   OPENAI_API_KEY=你的DeepSeek_API密钥
   ```
3. **保存为** `.env.local`
   - 保存类型选择：**所有文件 (*.*)**
   - 文件名输入：`.env.local`（包括前面的点）
   - 保存到：`E:\LTNS` 目录

---

## 🔍 如何获取 DeepSeek API 密钥

1. **访问 DeepSeek 平台**
   - 网址：https://platform.deepseek.com/

2. **登录或注册账户**

3. **获取 API 密钥**
   - 进入 API Keys 或 密钥管理 页面
   - 创建新密钥
   - 复制密钥（只显示一次，请保存）

4. **确认账户余额**
   - 确保账户有足够余额
   - DeepSeek 需要充值才能使用

---

## ✅ 验证配置

1. **确认文件存在**
   - 文件路径：`E:\LTNS\.env.local`
   - 文件内容：`OPENAI_API_KEY=sk-...`

2. **重启开发服务器**
   - 停止当前服务器（Ctrl+C）
   - 重新运行：`npm run dev`

3. **测试 API**
   - 在浏览器中打开网站
   - 尝试使用 AI 聊天功能
   - 应该不再出现 "API key not configured" 错误

---

## ⚠️ 注意事项

1. **不要提交 .env.local 到 Git**
   - `.env.local` 已经在 `.gitignore` 中
   - 这是正确的，密钥不应该公开

2. **开发和生产环境**
   - **本地开发**：使用 `.env.local`
   - **Vercel 部署**：在 Vercel Dashboard 中配置环境变量

3. **Vercel 环境变量配置**
   - 进入 Vercel Dashboard
   - 项目 Settings → Environment Variables
   - 添加：`OPENAI_API_KEY` = 你的密钥

---

## 🆘 如果还是不行

1. **检查文件是否正确**
   ```powershell
   # 在项目目录运行
   Get-Content .env.local
   ```
   应该显示：`OPENAI_API_KEY=sk-...`

2. **检查文件名**
   - 必须是 `.env.local`（包括前面的点）
   - 不是 `env.local` 或 `.env.local.txt`

3. **重启服务器**
   - 完全停止服务器（关闭终端窗口）
   - 重新运行 `npm run dev`

4. **检查 API 密钥格式**
   - 确保没有多余的空格
   - 确保没有引号
   - 格式：`OPENAI_API_KEY=sk-xxxxxxxxxxxx`




