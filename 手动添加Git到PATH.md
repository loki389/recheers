# 手动添加 Git 到 PATH 环境变量

## 方法一：使用脚本（推荐）

运行 `添加Git到PATH.ps1` 脚本（需要管理员权限）：

1. 右键点击 PowerShell
2. 选择"以管理员身份运行"
3. 执行：`.\添加Git到PATH.ps1`

---

## 方法二：手动添加（图形界面）

### 步骤 1：找到 Git 安装路径

Git 通常安装在：
- `C:\Program Files\Git\cmd`
- `C:\Program Files (x86)\Git\cmd`

如果找不到，可以：
1. 打开"开始"菜单
2. 搜索 "Git Bash" 或 "Git CMD"
3. 右键点击，选择"打开文件位置"
4. 在文件资源管理器中，导航到 `cmd` 文件夹
5. 复制完整路径（例如：`C:\Program Files\Git\cmd`）

### 步骤 2：添加到 PATH

#### Windows 10/11：

1. **打开系统属性**
   - 按 `Win + R`，输入 `sysdm.cpl`，回车
   - 或右键"此电脑" → "属性" → "高级系统设置"

2. **编辑环境变量**
   - 点击"环境变量"按钮
   - 在"用户变量"区域，找到 `Path` 变量
   - 选中 `Path`，点击"编辑"

3. **添加 Git 路径**
   - 点击"新建"
   - 输入 Git 的 cmd 目录路径（例如：`C:\Program Files\Git\cmd`）
   - 点击"确定"保存所有窗口

4. **验证**
   - 关闭所有打开的 PowerShell/CMD 窗口
   - 重新打开 PowerShell 或 CMD
   - 执行：`git --version`
   - 如果显示版本号，说明成功！

---

## 方法三：使用命令行（PowerShell）

### 临时添加（仅当前会话）

```powershell
$env:Path += ";C:\Program Files\Git\cmd"
git --version
```

### 永久添加到用户 PATH

```powershell
# 需要管理员权限
$gitPath = "C:\Program Files\Git\cmd"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = $currentPath + ";$gitPath"
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

**注意**：执行后需要重启 PowerShell 或 CMD。

---

## 方法四：重新安装 Git 并添加到 PATH

如果其他方法都不行，可以：

1. 卸载当前 Git
2. 重新下载 Git for Windows：https://git-scm.com/download/win
3. **安装时务必勾选**：
   - ✅ "Add Git to PATH"
   - ✅ "Git from the command line and also from 3rd-party software"

---

## 验证安装

添加 PATH 后，**关闭并重新打开** PowerShell 或 CMD，然后执行：

```bash
# 检查 Git 版本
git --version

# 检查 Git 路径
where git

# 查看 Git 配置
git config --global --list
```

如果都能正常显示，说明配置成功！

---

## 常见问题

### Q: 添加后还是显示"无法识别 git"

**解决方案**：
1. 确认已关闭所有终端窗口并重新打开
2. 检查路径是否正确（注意大小写）
3. 确认 Git 确实安装在那个路径
4. 尝试重启电脑

### Q: 找不到 Git 安装路径

**解决方案**：
1. 打开"开始"菜单，搜索 "Git"
2. 右键点击 Git 相关程序，选择"打开文件位置"
3. 导航到 `cmd` 文件夹
4. 复制该文件夹的完整路径

### Q: 没有管理员权限

**解决方案**：
- 使用"方法三"的临时添加方式
- 或联系系统管理员帮助添加

---

## 完成后配置 Git 用户名和邮箱

PATH 配置成功后，执行：

```bash
git config --global user.name "您的姓名"
git config --global user.email "your.email@example.com"
```

验证：
```bash
git config --global user.name
git config --global user.email
```

