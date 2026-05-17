# 酒别重逢后端说明

## 启动

```bash
npm start
```

默认地址：

```text
http://localhost:3000
```

页面：

- 首页：`http://localhost:3000/`
- 社区：`http://localhost:3000/community.html`

数据文件会自动生成在：

```text
data/db.json
```

## 已实现接口

### 账号

- `POST /api/auth/register` 注册
- `POST /api/auth/login` 密码登录
- `POST /api/auth/sms/send` 发送短信验证码
- `POST /api/auth/sms/login` 短信登录
- `GET /api/auth/me` 获取当前用户
- `POST /api/auth/logout` 退出登录

登录成功后返回 `token`，前端用：

```http
Authorization: Bearer <token>
```

### 社区

- `GET /api/community/posts` 获取帖子
- `POST /api/community/posts` 发布帖子，需登录

### 调研与数据

- `GET /api/survey/samples` 获取新增样本
- `POST /api/survey/samples` 提交样本
- `DELETE /api/survey/samples` 清空新增样本
- `GET /api/metrics` 获取聚合后的动态数据

### AI 代理

- `POST /api/chat`

需要配置 `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`。

## 短信 API 接入

静态前端不能直接保存短信平台密钥，所以短信接口放在后端。

开发模式下，`/api/auth/sms/send` 会返回：

```json
{ "devCode": "123456" }
```

生产环境建议配置：

```text
SMS_DEV_MODE=false
SMS_PROVIDER_URL=https://你的短信网关/api/send
SMS_PROVIDER_TOKEN=你的服务端密钥
SMS_TEMPLATE_ID=login
```

`server.js` 会向 `SMS_PROVIDER_URL` 发送：

```json
{
  "phone": "13800000000",
  "code": "验证码",
  "template": "login"
}
```

真实短信商如果是阿里云、腾讯云、容联云等，建议再写一个很薄的短信网关服务，把上面的通用请求转换成对应厂商 SDK 调用。
