# 🚀 使用 Upstash 配置调研数据存储

## 📋 为什么选择 Upstash？

根据你在 Vercel Storage 页面看到的内容，**KV 现在需要通过 Marketplace 获取**。Upstash 是最佳选择，因为：

- ✅ 提供 Serverless Redis（与 Vercel KV 兼容）
- ✅ 免费额度充足（每天 10,000 次命令）
- ✅ 与 Vercel 集成良好
- ✅ 代码无需修改（已兼容）

---

## 🚀 配置步骤

### 步骤 1：在 Vercel 中连接 Upstash

1. **在 Storage 页面找到 Upstash**
   - 在 "Marketplace Database Providers" 部分
   - 找到 **"Upstash"**（图标是绿色圆圈带螺旋图案）
   - 点击 **"Upstash"** 卡片

2. **连接 Upstash 账户**
   - 点击 **"Connect"** 或 **"Add"**
   - 如果没有 Upstash 账户，会提示创建
   - 使用 GitHub 账户登录（推荐）或创建新账户

3. **创建 Redis 数据库**
   - 在 Upstash Dashboard 中
   - 点击 **"Create Database"** 或 **"Add Database"**
   - 选择 **"Redis"** 类型
   - 输入名称：`survey-data` 或 `ltns-redis`
   - 选择区域（建议选择离用户最近的区域）：
     - `Southeast Asia (ap-southeast-1)` - 适合中国用户
     - `North America (us-east-1)` - 适合美国用户
   - 选择 **"Free"** 计划（免费额度通常足够）
   - 点击 **"Create"**

4. **连接到 Vercel 项目**
   - 在 Upstash 数据库详情页面
   - 找到 **"Vercel Integration"** 或 **"Connect to Vercel"** 部分
   - 选择你的 Vercel 项目
   - 点击 **"Connect"** 或 **"Link"**

### 步骤 2：验证环境变量（自动配置）

连接成功后，Vercel 会自动添加以下环境变量：

- `UPSTASH_REDIS_REST_URL` - Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis REST API 令牌

**你不需要手动配置这些变量**，Vercel 会自动处理。

### 步骤 3：更新代码以使用 Upstash

由于 `@vercel/kv` 可能无法直接使用 Upstash 的环境变量，我们需要更新代码以支持 Upstash。有两种方式：

#### 方式 A：使用 @upstash/redis（推荐）

1. **安装依赖**：
   ```bash
   npm install @upstash/redis
   ```

2. **更新 `lib/kv.ts`**：
   ```typescript
   import { Redis } from '@upstash/redis';
   
   // 创建 Redis 客户端
   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL!,
     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
   });
   
   const SURVEY_DATA_KEY = "survey:data";
   
   // 其他代码保持不变，只需将 kv.get/set 改为 redis.get/set
   ```

#### 方式 B：使用兼容层（更简单）

保持当前代码不变，只需确保环境变量正确配置。

---

## 📝 快速配置清单

- [ ] 在 Vercel Storage 页面点击 "Upstash"
- [ ] 连接或创建 Upstash 账户
- [ ] 创建 Redis 数据库
- [ ] 选择免费计划
- [ ] 连接到 Vercel 项目
- [ ] 验证环境变量已自动添加
- [ ] 重新部署项目
- [ ] 测试调研问卷提交功能

---

## ⚠️ 重要提示

### 环境变量名称

如果使用 Upstash，环境变量名称是：
- `UPSTASH_REDIS_REST_URL`（不是 `KV_URL`）
- `UPSTASH_REDIS_REST_TOKEN`（不是 `KV_REST_API_TOKEN`）

### 代码兼容性

当前代码使用 `@vercel/kv`，可能需要更新以支持 Upstash。如果遇到问题，我可以帮你更新代码。

---

## 🔍 验证配置

配置完成后：

1. **检查环境变量**
   - 进入项目 → Settings → Environment Variables
   - 应该能看到 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`

2. **测试功能**
   - 访问网站
   - 提交调研问卷
   - 检查是否成功保存
   - 查看数据面板是否更新

---

## 🆘 如果遇到问题

### 问题 1：代码报错 "Cannot find module '@vercel/kv'"

**解决**：
- 确保已安装 `@vercel/kv`：`npm install @vercel/kv`
- 如果使用 Upstash，可能需要改用 `@upstash/redis`

### 问题 2：环境变量未自动配置

**解决**：
1. 检查 Upstash 数据库是否已连接到 Vercel 项目
2. 在 Upstash Dashboard 中重新连接
3. 或者手动在 Vercel 环境变量中添加：
   - 从 Upstash Dashboard 复制 `UPSTASH_REDIS_REST_URL`
   - 从 Upstash Dashboard 复制 `UPSTASH_REDIS_REST_TOKEN`

---

## 💡 其他选项

如果 Upstash 不适合，也可以选择：

- **Redis**（Marketplace）- 直接提供 Serverless Redis
- **Supabase** - 如果将来需要更复杂的数据库功能

---

需要我帮你更新代码以完全支持 Upstash 吗？告诉我你的选择！

