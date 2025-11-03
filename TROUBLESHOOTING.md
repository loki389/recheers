# 🔧 网页打不开 - 故障排除指南

## 🚨 常见问题和解决方案

### 问题 1：网页无法打开（localhost:3000 拒绝连接）

**可能原因：**
- 开发服务器没有运行
- 端口被占用
- 多个 Node 进程冲突

**解决方案：**

#### 方法 A：使用重启脚本（推荐）

双击运行 `重启服务器.bat`，它会自动：
1. 停止所有 Node 进程
2. 清理构建缓存
3. 重新启动服务器

#### 方法 B：手动重启

1. **停止所有 Node 进程**
   ```powershell
   # 在 PowerShell 中执行
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **清理缓存**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **重新启动**
   ```bash
   npm run dev
   ```

### 问题 2：页面加载但显示错误

**可能原因：**
- 代码错误
- 依赖问题
- 端口冲突

**解决方案：**

1. **检查终端输出**
   - 查看运行 `npm run dev` 的终端窗口
   - 查看是否有错误信息（红色文字）

2. **检查浏览器控制台**
   - 按 `F12` 打开开发者工具
   - 查看 Console 标签的错误信息
   - 查看 Network 标签的请求状态

3. **检查端口是否被占用**
   ```powershell
   netstat -ano | findstr ":3000"
   ```
   如果被占用，可以：
   - 停止占用端口的进程
   - 或使用其他端口：`npm run dev -- -p 3001`

### 问题 3：页面显示 Internal Server Error

**解决方案：**

1. **检查 API 路由**
   - 查看 `/api/chat`、`/api/metrics`、`/api/history` 是否正常

2. **检查环境变量**
   - 确认 `.env.local` 文件存在
   - 确认 `OPENAI_API_KEY` 已设置

3. **查看服务器日志**
   - 在运行 `npm run dev` 的终端中查看错误信息

### 问题 4：页面空白或加载缓慢

**解决方案：**

1. **清理浏览器缓存**
   - 按 `Ctrl + Shift + Delete`
   - 清除缓存和 Cookie
   - 或使用无痕模式访问

2. **检查网络请求**
   - 打开浏览器开发者工具（F12）
   - 查看 Network 标签
   - 检查哪些请求失败

3. **重启开发服务器**
   - 停止服务器（Ctrl+C）
   - 运行 `npm run dev` 重新启动

## ✅ 快速诊断步骤

### 步骤 1：检查服务器状态

在 PowerShell 中运行：
```powershell
# 检查端口是否被监听
netstat -ano | findstr ":3000"

# 检查 Node 进程
Get-Process -Name node -ErrorAction SilentlyContinue
```

### 步骤 2：检查项目文件

```powershell
# 检查关键文件是否存在
Test-Path app\page.tsx
Test-Path package.json
Test-Path next.config.ts
```

### 步骤 3：测试构建

```bash
# 尝试构建项目
npm run build
```

如果构建失败，查看错误信息并修复。

### 步骤 4：清理并重启

```powershell
# 停止所有进程
Get-Process -Name node | Stop-Process -Force

# 清理缓存
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 重新安装依赖（如果需要）
npm install

# 重新启动
npm run dev
```

## 🎯 常用命令

### 停止服务器
- 在运行 `npm run dev` 的终端窗口按 `Ctrl + C`

### 强制停止所有 Node 进程
```powershell
Get-Process -Name node | Stop-Process -Force
```

### 使用其他端口
```bash
npm run dev -- -p 3001
```
然后在浏览器访问 `http://localhost:3001`

### 查看详细日志
```bash
# 显示详细输出
npm run dev -- --debug
```

## 🔍 检查清单

如果网页打不开，按以下顺序检查：

- [ ] 开发服务器是否在运行？（终端窗口是否显示 "Ready"）
- [ ] 端口 3000 是否被占用？
- [ ] 浏览器访问的 URL 是否正确？（应该是 `http://localhost:3000`）
- [ ] 防火墙是否阻止了连接？
- [ ] 是否有多个 Node 进程在运行？
- [ ] 构建缓存是否需要清理？
- [ ] 代码是否有语法错误？

## 🆘 如果以上方法都不行

1. **完全重启**
   - 关闭所有终端窗口
   - 关闭浏览器
   - 重新打开终端，运行 `npm run dev`
   - 重新打开浏览器访问

2. **重新安装依赖**
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

3. **检查项目完整性**
   - 运行 `.\check-deployment.ps1` 检查文件
   - 确认所有必需文件都存在

---

## 💡 提示

- **最简单的解决方案**：双击运行 `重启服务器.bat`
- **查看错误信息**：始终先查看终端输出和浏览器控制台
- **端口冲突**：如果 3000 端口被占用，使用 3001、3002 等


