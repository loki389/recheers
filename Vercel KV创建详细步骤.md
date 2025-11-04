# 📍 Vercel KV 创建详细步骤（找不到 Storage 时）

## 🔍 找不到 Storage 选项的常见情况

### 情况 1：顶部导航栏没有 Storage

**解决方案**：
1. 确保你已经登录 Vercel Dashboard
2. 检查是否在正确的账户（免费账户也支持 KV）
3. 尝试直接访问：https://vercel.com/dashboard/stores
4. 如果还是看不到，可能需要先创建一个项目

### 情况 2：在项目部署页面找不到

**解决方案**：
1. 先完成项目的基本部署（即使没有 KV）
2. 部署完成后，进入项目设置页面
3. 在项目设置中找到 Storage 选项

---

## 🚀 完整步骤（推荐流程）

### 第一步：先部署项目（如果还没部署）

1. **导入项目**
   - 在 Vercel Dashboard 点击 **"Add New..."** → **"Project"**
   - 选择你的 GitHub 仓库
   - 点击 **"Import"**

2. **配置项目**
   - Framework Preset: `Next.js`（自动检测）
   - Root Directory: 留空
   - 其他保持默认

3. **添加环境变量**
   - 在 **"Environment Variables"** 部分
   - 添加 `OPENAI_API_KEY` = 你的 DeepSeek 密钥
   - 选择所有环境（Production、Preview、Development）

4. **部署**
   - 点击 **"Deploy"**
   - 等待部署完成

### 第二步：创建 KV 数据库

#### 方式 A：从 Dashboard 主页创建

1. **回到 Dashboard 主页**
   - 点击左上角的 **"Vercel"** Logo 或 **"Dashboard"**

2. **查找 Storage**
   - 查看顶部导航栏，应该有 **"Storage"** 或 **"Stores"**
   - 如果没有，查看左侧菜单
   - 或者直接访问：https://vercel.com/dashboard/stores

3. **创建 KV**
   - 点击 **"Create Database"** 或 **"Add"**
   - 选择 **"KV"**
   - 输入名称：`survey-data`
   - 选择区域：`Southeast Asia (ap-southeast-1)` 或 `North America (us-east-1)`
   - 点击 **"Create"**

#### 方式 B：从项目设置中创建

1. **进入项目**
   - 在 Dashboard 中点击你的项目名称

2. **进入 Settings**
   - 点击顶部菜单的 **"Settings"**

3. **查找 Storage**
   - 在左侧菜单中查找 **"Storage"** 或 **"Integrations"**
   - 或者查看页面中的 **"Storage"** 部分

4. **创建 KV**
   - 点击 **"Create Database"** 或 **"Connect Database"**
   - 选择 **"KV"**
   - 输入名称和选择区域
   - 点击 **"Create"**

### 第三步：连接 KV 到项目

1. **进入 KV 数据库页面**
   - 点击刚创建的 KV 数据库卡片

2. **连接到项目**
   - 在页面中找到 **"Connect to Project"** 或 **"Projects"** 部分
   - 点击 **"Connect Project"** 或 **"Add Project"**
   - 选择你的项目
   - 点击 **"Connect"** 或 **"Save"**

3. **验证连接**
   - 连接后，环境变量会自动添加到项目中
   - 可以进入项目 → Settings → Environment Variables 查看
   - 应该能看到 `KV_URL`、`KV_REST_API_URL`、`KV_REST_API_TOKEN`

### 第四步：重新部署

1. **触发重新部署**
   - 进入项目 → **"Deployments"**
   - 点击最新部署右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 或者推送新的代码到 GitHub（会自动触发部署）

2. **验证功能**
   - 部署完成后，访问你的网站
   - 测试调研问卷提交功能
   - 检查数据面板是否更新

---

## 🆘 如果还是找不到 Storage

### 检查清单

- [ ] 确认已登录 Vercel Dashboard
- [ ] 确认账户状态正常（免费账户也支持）
- [ ] 尝试直接访问：https://vercel.com/dashboard/stores
- [ ] 检查浏览器是否阻止了某些元素（尝试禁用广告拦截器）
- [ ] 尝试使用不同的浏览器（Chrome、Firefox、Edge）
- [ ] 清除浏览器缓存并刷新页面

### 替代方案

如果确实无法找到 Storage 选项，可以：

1. **联系 Vercel 支持**
   - 访问：https://vercel.com/support
   - 说明你在寻找 Storage/KV 创建入口

2. **使用 Vercel CLI**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录
   vercel login
   
   # 创建 KV（如果支持）
   vercel kv create survey-data
   ```

3. **使用其他存储方案**
   - Supabase（免费 PostgreSQL）
   - MongoDB Atlas（免费 MongoDB）
   - PlanetScale（免费 MySQL）

---

## 📝 验证 KV 是否配置成功

配置完成后，检查：

1. **环境变量**
   - 进入项目 → Settings → Environment Variables
   - 应该能看到：
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

2. **功能测试**
   - 访问网站
   - 提交调研问卷
   - 检查是否成功保存
   - 查看数据面板是否更新

---

## 💡 提示

- **免费账户支持 KV**：Vercel 的免费计划包含 256MB 的 KV 存储
- **区域选择**：选择离你的用户最近的区域，可以减少延迟
- **自动配置**：连接 KV 到项目后，环境变量会自动配置，无需手动添加

如果还有问题，请告诉我你在哪个页面，我可以提供更具体的指导！

