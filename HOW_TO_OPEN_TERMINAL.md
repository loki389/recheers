# 📖 如何在项目目录打开终端

## 🎯 最简单的方法（推荐）

### 方法 1：使用我创建的快捷脚本 ⭐

在 `e:\LTNS\` 文件夹中，双击运行：

- **`打开终端.bat`** - 打开终端窗口
- **`快速部署.bat`** - 自动执行 Git 初始化、添加和提交文件

### 方法 2：在文件夹中直接打开

1. **打开文件资源管理器**
   - 按 `Win + E` 打开资源管理器
   - 导航到 `e:\LTNS`

2. **打开终端**
   - **方法 A**：在地址栏输入 `powershell`，然后按回车
   - **方法 B**：按住 `Shift`，右键点击文件夹空白处，选择：
     - "在此处打开 PowerShell 窗口"
     - 或 "在此处打开命令窗口"

### 方法 3：使用开始菜单

1. 按 `Win` 键，搜索 "PowerShell" 或 "命令提示符"
2. 打开后，输入：
   ```bash
   cd e:\LTNS
   ```
3. 按回车

### 方法 4：使用运行对话框

1. 按 `Win + R`
2. 输入以下命令之一：

   **PowerShell：**
   ```
   powershell -NoExit -Command "cd e:\LTNS"
   ```

   **CMD：**
   ```
   cmd /k "cd /d e:\LTNS"
   ```

3. 按回车

### 方法 5：在 VS Code / Cursor 中

如果你使用 VS Code 或 Cursor：

1. 在编辑器中选择 `e:\LTNS` 文件夹
2. 按 `` Ctrl + ` ``（反引号键）
3. 终端会自动打开在项目目录

## ✅ 验证终端位置

打开终端后，你会看到类似这样的提示符：

**PowerShell：**
```
PS e:\LTNS>
```

**CMD：**
```
e:\LTNS>
```

如果显示的不是 `e:\LTNS`，输入：
```bash
cd e:\LTNS
```

## 🚀 执行 Git 命令

终端打开后，你可以执行：

```bash
# 检查 Git 是否安装
git --version

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 检查状态
git status

# 提交文件
git commit -m "Initial commit: 酒别重逢项目"
```

## 💡 提示

- 如果 Git 命令不识别，说明 Git 未安装，需要先安装 Git
- 推荐使用 PowerShell（功能更强大）
- 如果使用 GitHub Desktop，可能不需要命令行

---

## 🎬 快速开始

**最简单的方式：**

1. 在 `e:\LTNS` 文件夹中，双击 `快速部署.bat`
2. 按照提示操作
3. 完成！


