# ✅ KV 连接后检查清单

## 问题：KV 已连接但提交仍然失败

如果看到提示 "This project is already connected to the target store"，说明 KV 已经连接，但可能还有以下问题需要检查：

---

## 📋 检查步骤

### 1. 确认环境变量已应用到所有环境

**重要**：KV 连接后，环境变量需要应用到所有环境！

1. **进入 Vercel Dashboard**
   - 项目 → **Settings** → **Environment Variables**

2. **检查每个 KV 环境变量**
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

3. **确认环境设置**
   - 每个变量都应该设置为 **"All Environments"**（所有环境）
   - 如果只设置了 Production，Preview 和 Development 环境会失败

4. **如果只设置了部分环境**
   - 点击每个变量右侧的编辑按钮
   - 确保勾选了：
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - 保存

### 2. 重新部署项目（必须）

**重要**：即使 KV 已连接，也需要重新部署才能生效！

1. **进入 Deployments**
   - 项目 → **Deployments**

2. **重新部署**
   - 点击最新部署右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 等待部署完成（1-2 分钟）

### 3. 验证 KV 连接

1. **检查 KV 数据库状态**
   - 进入 Vercel Dashboard → **Storage**
   - 找到你的 KV 数据库
   - 确认状态是 **"Connected"**（已连接）

2. **检查项目连接**
   - 在 KV 数据库详情页面
   - 查看 **"Connected Projects"** 部分
   - 确认你的项目在列表中

### 4. 查看部署日志

重新部署后，查看日志：

1. **进入 Deployments** → 最新部署 → **Functions**
2. **查找 `/api/survey` 函数**
3. **查看日志**，应该看到：
   - ✅ 没有 "KV storage not configured" 错误
   - ✅ 没有导入错误

---

## 🔧 如果还是失败

### 检查环境变量名称

确认环境变量名称正确：
- `KV_URL` 或 `KV_REST_API_URL`（至少有一个）
- `KV_REST_API_TOKEN`（必需）

### 检查代码是否正确

代码已经更新为使用 `@vercel/kv`，应该能自动检测环境变量。

### 查看详细错误

1. **提交问卷后，查看浏览器控制台**
   - 按 F12 → Console
   - 查看错误信息

2. **查看 Vercel 函数日志**
   - Deployments → 最新部署 → Functions → `/api/survey` → Logs
   - 查找错误信息

3. **把错误信息发给我**，我可以帮你进一步诊断

---

## ✅ 验证成功

配置成功后，应该：
- ✅ 可以正常提交调研问卷
- ✅ 提交后显示成功消息
- ✅ 数据面板更新显示新数据
- ✅ Vercel 日志中没有错误

---

## 🆘 快速检查

如果还是不行，请告诉我：
1. 环境变量是否应用到所有环境（Production、Preview、Development）？
2. 是否已经重新部署？
3. 浏览器控制台的错误信息是什么？
4. Vercel 日志中的错误信息是什么？

