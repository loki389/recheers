# 酒别重逢 Flask 后端

项目名称：酒别重逢——非遗与 AI 时代的共享经济新范式

本后端用于托管现有 `index.html`、`community.html`、`logo.jpg`、`intro.mp4`，并提供首页 AI 调酒助手、动态问卷、用户认证和社区发帖所需的最小可行接口。

## 接口扫描结果

从现有前端识别到的接口：

- `POST /api/chat`
- `GET /api/survey/samples`
- `POST /api/survey/samples`
- `DELETE /api/survey/samples`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/sms/send`
- `POST /api/auth/sms/login`
- `GET /api/community/posts`
- `POST /api/community/posts`

后端额外提供：

- `GET /api/dashboard/metrics`
- `GET /api/metrics`，兼容旧接口别名
- `GET /api/health`

## 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

## 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
copy .env.example .env
```

填写 MySQL 密码和 DeepSeek API Key：

```text
MYSQL_PASSWORD=你的 MySQL 密码
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

## 创建数据库

先在 MySQL 中执行：

```sql
CREATE DATABASE recheers_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

应用启动时会执行 `db.create_all()` 自动创建以下表：

- `users`
- `survey_samples`
- `community_posts`
- `sms_codes`

## 启动后端

```bash
python app.py
```

访问：

- 首页：`http://127.0.0.1:5000/`
- 首页别名：`http://127.0.0.1:5000/index.html`
- 社区页：`http://127.0.0.1:5000/community.html`

推荐用 Flask 托管页面访问，这样前端 `/api/...` 相对路径可以直接命中后端。

## 接口测试示例

注册：

```bash
curl -X POST http://127.0.0.1:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"测试用户\",\"phone\":\"13800000000\",\"password\":\"123456\"}"
```

登录：

```bash
curl -X POST http://127.0.0.1:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"测试用户\",\"password\":\"123456\"}"
```

AI 调酒助手：

```bash
curl -X POST http://127.0.0.1:5000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"deepseek-chat\",\"messages\":[{\"role\":\"user\",\"content\":\"我只有柠檬和苏打水，怎么做低酒精饮品？\"}],\"temperature\":0.7}"
```

提交问卷样本：

```bash
curl -X POST http://127.0.0.1:5000/api/survey/samples ^
  -H "Content-Type: application/json" ^
  -d "{\"age\":\"18-22\",\"gender\":\"男\",\"region\":\"华中\",\"freq\":2,\"cost\":28,\"flavor\":\"清爽\",\"alcohol\":true,\"tool\":\"摇壶\",\"ingredient\":\"柠檬\"}"
```

读取问卷样本：

```bash
curl http://127.0.0.1:5000/api/survey/samples
```

读取社区帖子：

```bash
curl http://127.0.0.1:5000/api/community/posts
```

发布社区帖子：

```bash
curl -X POST http://127.0.0.1:5000/api/community/posts ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer JWT_TOKEN" ^
  -d "{\"title\":\"宿舍版金汤力替代方案\",\"body\":\"密封罐可以替代摇壶。\",\"tags\":[\"清爽\",\"低酒精\",\"无摇壶\"]}"
```

## 静态资源托管

`backend/static/` 中包含：

- `index.html`
- `community.html`
- `logo.jpg`
- `intro.mp4`

Flask 会直接托管这些文件，适合本地演示和后续通过 Nginx 反向代理部署。

## 部署预留

云服务器部署时建议：

1. 使用 Gunicorn 或 uWSGI 运行 Flask 应用。
2. 使用 Nginx 反向代理到 Flask 服务。
3. MySQL 使用独立数据库账号。
4. 生产环境关闭 `RETURN_SMS_DEV_CODE`。
5. `DELETE /api/survey/samples` 正式上线前应改为管理员权限。
