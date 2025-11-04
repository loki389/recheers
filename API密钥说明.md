# 🔑 API 密钥说明

## 📋 你的当前 API 密钥

**位置**：`E:\LTNS\.env.local`

**当前密钥**：`sk-f9f905ee7af64dcfae123e55c3566559...`

⚠️ **注意**：这个密钥可能是旧的 OpenAI 密钥

---

## ⚠️ 重要提示

### 当前代码使用：DeepSeek API

代码已配置为使用 **DeepSeek API**（不是 OpenAI）：
- API 端点：`https://api.deepseek.com/v1`
- 模型：`deepseek-chat`

### 如果你的密钥是 OpenAI 的

需要替换为 **DeepSeek API 密钥**：

1. **获取 DeepSeek 密钥**
   - 访问：https://platform.deepseek.com/
   - 登录/注册账户
   - 进入 API Keys 页面
   - 创建新密钥并复制

2. **更新 .env.local**
   - 打开：`E:\LTNS\.env.local`
   - 修改为：`OPENAI_API_KEY=你的DeepSeek密钥`
   - 保存

3. **重启开发服务器**

---

## 🔍 如何查看完整密钥

### 方法 1：直接打开文件

1. 打开文件管理器
2. 导航到：`E:\LTNS`
3. 找到 `.env.local` 文件
4. 右键 → 打开方式 → 记事本
5. 查看内容

### 方法 2：使用脚本

双击运行：`查看API密钥.bat`

---

## ✅ 密钥检查清单

### 本地开发：

- [ ] `.env.local` 文件存在
- [ ] 密钥格式：`sk-xxxxxxxxxxxx`
- [ ] 密钥是 DeepSeek API 密钥（不是 OpenAI）
- [ ] 账户有余额

### Vercel 部署：

- [ ] 在 Vercel Dashboard 中配置了 `OPENAI_API_KEY`
- [ ] 使用了相同的 DeepSeek 密钥
- [ ] 选择了所有环境（Production, Preview, Development）

---

## 🚨 如果密钥无效

### 错误：401 Unauthorized
- **原因**：密钥无效或错误
- **解决**：更新为正确的 DeepSeek 密钥

### 错误：402 Insufficient Balance
- **原因**：账户余额不足
- **解决**：在 DeepSeek 平台充值

---

## 💡 建议

1. **使用相同的密钥**
   - 本地：`.env.local`
   - Vercel：Environment Variables
   - 两者使用同一个 DeepSeek 密钥

2. **保护好密钥**
   - 不要分享密钥
   - `.env.local` 不会推送到 Git（已忽略）
   - Vercel 环境变量是加密存储的

3. **定期检查**
   - 确认账户余额充足
   - 确认密钥未被撤销

---

## 🆘 忘记密钥了？

1. **查看本地配置**：运行 `查看API密钥.bat`
2. **查看 Vercel 配置**：Dashboard → Settings → Environment Variables
3. **重新生成**：在 DeepSeek 平台生成新密钥




