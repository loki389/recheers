# 🔑 修复 API 密钥问题

## 当前状态

✅ `.env.local` 文件已存在  
⚠️ 但 API 密钥可能不正确或已失效

## 问题原因

错误信息：`OpenAI API key not configured`

可能的原因：
1. **密钥是旧的 OpenAI 密钥**（代码现在使用 DeepSeek）
2. **密钥格式不正确**
3. **开发服务器没有读取环境变量**（需要重启）
4. **DeepSeek API 密钥无效或余额不足**

---

## ✅ 解决步骤

### 步骤 1：获取 DeepSeek API 密钥

1. **访问 DeepSeek 平台**
   - 网址：https://platform.deepseek.com/
   - 或搜索 "DeepSeek API"

2. **登录/注册账户**

3. **获取 API 密钥**
   - 进入 API Keys 页面
   - 创建新密钥
   - **复制密钥**（格式类似：`sk-xxxxxxxxxxxx`）

4. **确认账户余额**
   - 检查账户是否有余额
   - DeepSeek 需要充值才能使用

---

### 步骤 2：更新 .env.local 文件

#### 方法 A：使用脚本（推荐）

双击运行：`创建env文件.bat`

按提示输入你的 DeepSeek API 密钥。

#### 方法 B：手动编辑

1. **打开文件**：`E:\LTNS\.env.local`

2. **修改内容为**：
   ```
   OPENAI_API_KEY=你的DeepSeek_API密钥
   ```
   
   例如：
   ```
   OPENAI_API_KEY=sk-你的DeepSeek密钥
   ```

3. **保存文件**

---

### 步骤 3：重启开发服务器

⚠️ **重要**：修改 `.env.local` 后必须重启服务器！

1. **停止当前服务器**
   - 在运行 `npm run dev` 的终端窗口按 `Ctrl + C`
   - 或关闭终端窗口

2. **重新启动服务器**
   ```bash
   npm run dev
   ```
   或运行：`智能重启服务器.bat`

3. **等待编译完成**（通常 10-20 秒）

---

### 步骤 4：测试

1. **打开浏览器**：http://localhost:3000
2. **尝试使用 AI 聊天功能**
3. **检查是否还有错误**

---

## 🔍 验证配置

运行以下命令检查配置：

```powershell
# 检查文件内容（注意：会显示密钥）
Get-Content .env.local
```

应该显示：
```
OPENAI_API_KEY=sk-你的密钥
```

---

## ⚠️ 常见问题

### 问题 1：还是显示 "API key not configured"

**解决**：
1. 确认文件名为 `.env.local`（不是 `env.local` 或其他）
2. 确认在项目根目录 `E:\LTNS` 下
3. 确认内容格式：`OPENAI_API_KEY=sk-xxx`（没有引号，没有空格）
4. **重启开发服务器**

### 问题 2：显示 "402 Insufficient Balance"

**原因**：DeepSeek 账户余额不足

**解决**：
1. 访问 https://platform.deepseek.com/
2. 充值账户
3. 确保有足够余额

### 问题 3：密钥无效

**原因**：使用了错误的密钥（可能是 OpenAI 的旧密钥）

**解决**：
1. 获取新的 DeepSeek API 密钥
2. 更新 `.env.local` 文件
3. 重启服务器

---

## 📝 重要提示

1. **不要分享 API 密钥**
   - `.env.local` 已在 `.gitignore` 中，不会提交到 Git
   - 这是正确的安全做法

2. **本地和 Vercel 都需要配置**
   - **本地**：使用 `.env.local`
   - **Vercel**：在 Dashboard → Settings → Environment Variables 中配置

3. **如果密钥泄漏**
   - 立即在 DeepSeek 平台撤销旧密钥
   - 生成新密钥
   - 更新所有使用的地方

---

## ✅ 完成后

配置完成后：
1. ✅ 重启开发服务器
2. ✅ 测试 AI 聊天功能
3. ✅ 应该可以正常使用了

