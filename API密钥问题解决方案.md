# 🔑 API 密钥问题解决方案

## ⚠️ 错误信息
```
API请求失败 (500): {"error":"OpenAI API key not configured"}
```

## ✅ 快速解决

### 当前状态
- ✅ `.env.local` 文件已存在
- ⚠️ 可能的问题：
  1. 服务器没有重启（环境变量未加载）
  2. API 密钥不正确（可能是旧的 OpenAI 密钥）
  3. DeepSeek 账户余额不足

---

## 🚀 解决步骤

### 步骤 1：重启开发服务器

**重要**：修改 `.env.local` 后必须重启服务器才能生效！

#### 方法 A：使用脚本（推荐）
双击运行：`修复API密钥并重启.bat`

#### 方法 B：手动重启
1. 停止当前服务器（终端窗口按 `Ctrl + C`）
2. 重新运行：`npm run dev`

---

### 步骤 2：验证 API 密钥

检查你的密钥是否是 **DeepSeek API 密钥**：

1. **当前密钥格式**：`sk-f9f905ee7af64dcfae123e55c3566559`
   - 这个看起来可能是旧的 OpenAI 密钥
   - **需要替换为 DeepSeek API 密钥**

2. **如何获取 DeepSeek 密钥**：
   - 访问：https://platform.deepseek.com/
   - 登录/注册
   - 进入 API Keys 页面
   - 创建新密钥
   - 复制密钥（格式类似：`sk-xxxxxxxxxxxx`）

3. **更新 .env.local**：
   - 打开文件：`E:\LTNS\.env.local`
   - 修改为：`OPENAI_API_KEY=你的DeepSeek密钥`
   - 保存文件
   - **再次重启服务器**

---

### 步骤 3：确认 DeepSeek 账户状态

1. **检查余额**
   - 访问：https://platform.deepseek.com/
   - 确认账户有余额
   - DeepSeek 需要充值才能使用

2. **常见错误和解决**：
   - `401 Unauthorized` → 密钥无效，更新密钥
   - `402 Insufficient Balance` → 余额不足，需要充值
   - `500 Internal Server Error` → 服务器问题，稍后重试

---

## 📝 完整的修复流程

```
1. 停止服务器 (Ctrl+C)
   ↓
2. 检查 .env.local 文件
   - 确认使用 DeepSeek API 密钥
   - 格式：OPENAI_API_KEY=sk-xxx
   ↓
3. 更新密钥（如果需要）
   - 获取新的 DeepSeek 密钥
   - 更新 .env.local
   ↓
4. 重启服务器
   - npm run dev
   或
   - 运行：修复API密钥并重启.bat
   ↓
5. 等待编译完成（20-30秒）
   ↓
6. 测试 AI 聊天功能
```

---

## 🔍 验证配置

运行以下命令检查：

```powershell
# 查看当前配置
Get-Content .env.local
```

应该显示：
```
OPENAI_API_KEY=sk-你的DeepSeek密钥
```

**注意**：
- ✅ 使用 DeepSeek 密钥（不是 OpenAI）
- ✅ 没有引号
- ✅ 没有多余空格

---

## 🆘 如果还是不行

### 检查清单：

1. **密钥是否正确**
   - [ ] 是 DeepSeek API 密钥（不是 OpenAI）
   - [ ] 密钥格式正确（sk-开头）
   - [ ] 没有多余的空格或字符

2. **服务器是否重启**
   - [ ] 完全停止了旧服务器
   - [ ] 重新启动了新服务器
   - [ ] 等待了足够的编译时间

3. **账户状态**
   - [ ] DeepSeek 账户有余额
   - [ ] 密钥没有被撤销
   - [ ] 账户状态正常

4. **文件配置**
   - [ ] `.env.local` 在项目根目录
   - [ ] 文件名正确（包括前面的点）
   - [ ] 文件内容格式正确

---

## ✅ 快速修复脚本

如果不想手动操作，运行：
- `修复API密钥并重启.bat` - 自动重启服务器并显示配置信息

---

**记住**：使用 DeepSeek API 密钥，不是 OpenAI 的！并且修改后必须重启服务器！




