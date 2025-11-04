# Git 配置指南

## 快速开始

### 方法一：使用配置脚本（推荐）

#### Windows 批处理脚本
1. 双击运行 `配置Git.bat`
2. 按照提示输入用户名和邮箱
3. 完成！

#### PowerShell 脚本
1. 右键点击 `配置Git.ps1`，选择"使用 PowerShell 运行"
2. 或者打开 PowerShell，执行：
   ```powershell
   .\配置Git.ps1
   ```
3. 按照提示输入用户名和邮箱

---

### 方法二：手动配置

#### 1. 检查 Git 是否安装

打开 PowerShell 或 CMD，执行：
```bash
git --version
```

如果显示版本号，说明已安装。如果显示错误，需要先安装 Git。

#### 2. 安装 Git（如果未安装）

1. 访问：https://git-scm.com/download/win
2. 下载 Git for Windows
3. 安装时**务必选择 "Add Git to PATH"** 选项
4. 完成安装后重启终端

#### 3. 配置用户名和邮箱

在项目目录 `E:\LTNS` 打开 PowerShell 或 CMD，执行：

```bash
# 设置全局用户名（用于所有仓库）
git config --global user.name "您的姓名"

# 设置全局邮箱（用于所有仓库）
git config --global user.email "your.email@example.com"

# 或者只为当前项目设置（在项目目录下执行）
git config user.name "您的姓名"
git config user.email "your.email@example.com"
```

#### 4. 验证配置

```bash
# 查看全局配置
git config --global user.name
git config --global user.email

# 查看所有配置
git config --global --list
```

#### 5. 初始化 Git 仓库（如果需要）

在项目目录下执行：
```bash
cd E:\LTNS
git init
```

---

## 常用 Git 配置

### 设置默认编辑器
```bash
# 使用 VS Code
git config --global core.editor "code --wait"

# 使用记事本
git config --global core.editor "notepad"
```

### 设置默认分支名
```bash
git config --global init.defaultBranch main
```

### 配置换行符处理（Windows）
```bash
git config --global core.autocrlf true
```

### 查看所有配置
```bash
git config --global --list
```

---

## 故障排除

### Git 命令无法识别

**问题**：执行 `git` 命令时提示"无法识别"

**解决方案**：
1. 确认 Git 已安装
2. 检查环境变量 PATH 中是否包含 Git 路径
3. 通常 Git 安装在：`C:\Program Files\Git\cmd`
4. 手动添加 PATH：系统属性 → 环境变量 → Path → 添加 Git 安装路径

### 配置没有保存

**问题**：配置后再次查看显示为空

**解决方案**：
1. 确认使用 `--global` 参数
2. 检查是否有权限写入配置文件
3. 手动检查配置文件位置：`~/.gitconfig` (Windows: `C:\Users\您的用户名\.gitconfig`)

---

## 示例

假设您要设置：
- 用户名：张三
- 邮箱：zhangsan@example.com

执行命令：
```bash
git config --global user.name "张三"
git config --global user.email "zhangsan@example.com"
```

验证：
```bash
git config --global user.name
# 输出：张三

git config --global user.email
# 输出：zhangsan@example.com
```

---

## 下一步

配置完成后，您可以：
1. 初始化仓库：`git init`
2. 添加文件：`git add .`
3. 提交更改：`git commit -m "初始提交"`
4. 连接到远程仓库（如 GitHub）：`git remote add origin <仓库地址>`

