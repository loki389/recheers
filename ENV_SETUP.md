# 环境变量配置说明

## 必需的环境变量

在项目根目录创建 `.env.local` 文件，并添加以下变量：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册或登录账户
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 将 Key 复制到 `.env.local` 文件中

## 注意事项

- `.env.local` 文件已添加到 `.gitignore`，不会被提交到版本控制
- 在生产环境（如 Vercel）部署时，需要在平台设置中添加环境变量
- 不要将 API Key 提交到公共仓库

