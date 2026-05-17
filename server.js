import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
  try {
    const envText = await fs.readFile(path.join(__dirname, ".env"), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env is optional; environment variables can still be provided by the shell.
  }
}

await loadEnv();

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const SMS_TTL_MS = 1000 * 60 * 5;
const DEV_SMS = process.env.SMS_DEV_MODE !== "false";

const baseMetrics = {
  total: 3094,
  avgCost: 31,
  avgFrequency: 3.2,
  alcoholicPercentage: 65,
  regionDistribution: [["西北",469],["华北",446],["西南",444],["华中",443],["华南",437],["华东",432],["东北",423]],
  genderDistribution: [["男",1041],["女",989],["其他/不便透露",1064]],
  ageGroupDistribution: [["23-26",1019],["27-30",1064],["18-22",1011]],
  flavorDistribution: [["清爽",411],["果香",484],["草本",429],["酸甜",443],["苦味",449],["奶香",464],["气泡",414]],
  toolOwnership: [["摇壶",54],["量杯",55],["吧勺",45],["滤网",43],["捣棒",55]],
  topIngredients: [["柠檬",690],["伏特加",508],["糖浆",484],["威士忌",451],["金酒",414],["朗姆酒",408],["龙舌兰",393],["汤力水",325],["苏打水",309],["白兰地",309]],
  monthlyTrend: [["2025-06",328],["2025-07",452],["2025-08",487],["2025-09",621],["2025-10",678],["2025-11",528]],
  scatterData: [[4,38],[2,24],[2,43],[4,28],[7,30],[1,17],[5,18],[3,40],[6,26],[2,22],[7,22],[4,57],[1,45],[5,31],[7,29],[3,34],[4,17],[1,38],[5,28],[7,19],[4,59],[5,35],[4,52],[1,57],[6,21],[3,44],[1,20],[4,30],[3,50],[5,45],[2,40],[7,16],[1,60],[4,23],[3,38],[2,50],[1,49],[4,41],[3,34],[1,21],[4,51],[2,50],[6,20],[2,15],[5,30],[4,36],[1,23],[3,45],[2,44],[4,46],[5,32],[1,52],[3,59],[6,17],[7,27],[2,54],[4,42],[1,58],[3,23],[2,43],[1,32],[4,45],[6,29],[5,20],[2,29],[4,54],[2,52],[3,47],[6,16],[4,47],[5,16],[1,41],[2,55],[5,31],[4,57],[2,44],[3,43],[4,43],[5,28],[2,47],[1,59],[3,36],[1,46],[2,33],[3,37],[4,42],[1,48],[3,49],[6,30],[7,28]]
};

const seedPosts = [
  { id: "seed-1", author: "ReCheers 编辑部", title: "本周推荐：用冷泡茶降低自调门槛", body: "冷泡茶可以替代一部分果汁和软饮，和伏特加、金酒或无酒精基底都容易搭配。", tags: ["茶香", "低门槛"], createdAt: "2026-05-01T10:00:00.000Z" },
  { id: "seed-2", author: "校园调酒小组", title: "宿舍工具替代清单", body: "密封罐可以替代摇壶，茶滤可以替代滤网，量勺能解决比例不稳定的问题。", tags: ["工具替代", "新手"], createdAt: "2026-05-03T14:30:00.000Z" },
  { id: "seed-3", author: "自调体验官", title: "无酒精蜜桃菲士反馈", body: "蜜桃汁和苏打水比例控制在 1:2 更清爽，柠檬汁不要太多，否则会盖住桃香。", tags: ["无酒精", "果香"], createdAt: "2026-05-09T19:20:00.000Z" }
];

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"],
  [".ico", "image/x-icon"]
]);

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8"));
  } catch {
    const db = { users: [], sessions: [], smsCodes: [], posts: [], samples: [] };
    await saveDb(db);
    return db;
  }
}

async function saveDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("请求体过大"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error("JSON 格式不正确")); }
    });
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, phone: user.phone || "", createdAt: user.createdAt };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function createSession(db, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  db.sessions = db.sessions.filter(session => session.expiresAt > now);
  db.sessions.push({ token, userId, createdAt: new Date(now).toISOString(), expiresAt: now + SESSION_TTL_MS });
  return token;
}

function getBearer(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function requireUser(req, db) {
  const token = getBearer(req);
  const now = Date.now();
  const session = db.sessions.find(item => item.token === token && item.expiresAt > now);
  if (!session) return null;
  return db.users.find(user => user.id === session.userId) || null;
}

function addToRows(rows, name, amount = 1) {
  const found = rows.find(row => row[0] === name);
  if (found) found[1] += amount;
  else rows.push([name, amount]);
}

function computeMetrics(samples) {
  const metrics = JSON.parse(JSON.stringify(baseMetrics));
  let costSum = baseMetrics.avgCost * baseMetrics.total;
  let freqSum = baseMetrics.avgFrequency * baseMetrics.total;
  let alcoholCount = Math.round(baseMetrics.total * baseMetrics.alcoholicPercentage / 100);
  for (const sample of samples) {
    metrics.total += 1;
    costSum += Number(sample.cost || 0);
    freqSum += Number(sample.freq || 0);
    alcoholCount += sample.alcohol ? 1 : 0;
    addToRows(metrics.regionDistribution, sample.region);
    addToRows(metrics.genderDistribution, sample.gender);
    addToRows(metrics.ageGroupDistribution, sample.age);
    addToRows(metrics.flavorDistribution, sample.flavor);
    addToRows(metrics.toolOwnership, sample.tool);
    addToRows(metrics.topIngredients, sample.ingredient);
    metrics.scatterData.push([Number(sample.freq || 0), Number(sample.cost || 0)]);
    addToRows(metrics.monthlyTrend, String(sample.createdAt || new Date().toISOString()).slice(0, 7));
  }
  metrics.avgCost = Math.round(costSum / metrics.total);
  metrics.avgFrequency = Number((freqSum / metrics.total).toFixed(1));
  metrics.alcoholicPercentage = Math.round(alcoholCount / metrics.total * 100);
  metrics.regionDistribution.sort((a, b) => b[1] - a[1]);
  metrics.genderDistribution.sort((a, b) => b[1] - a[1]);
  metrics.ageGroupDistribution.sort((a, b) => b[1] - a[1]);
  metrics.flavorDistribution.sort((a, b) => b[1] - a[1]);
  metrics.toolOwnership.sort((a, b) => b[1] - a[1]);
  metrics.topIngredients.sort((a, b) => b[1] - a[1]);
  metrics.monthlyTrend.sort((a, b) => a[0].localeCompare(b[0]));
  return {
    total: metrics.total,
    statistics: {
      totalCount: metrics.total,
      avgCost: metrics.avgCost,
      avgFrequency: metrics.avgFrequency,
      alcoholicPercentage: metrics.alcoholicPercentage,
      regionDistribution: metrics.regionDistribution.map(([name, value]) => ({ name, value })),
      genderDistribution: metrics.genderDistribution.map(([name, value]) => ({ name, value })),
      ageGroupDistribution: metrics.ageGroupDistribution.map(([name, value]) => ({ name, value }))
    },
    flavorDistribution: metrics.flavorDistribution.map(([name, value]) => ({ name, value })),
    toolOwnership: metrics.toolOwnership.map(([name, value]) => ({ name, value })),
    topIngredients: metrics.topIngredients.slice(0, 10).map(([name, value]) => ({ name, value })),
    monthlyTrend: metrics.monthlyTrend.slice(-8).map(([month, count]) => ({ month, count })),
    scatterData: metrics.scatterData
  };
}

async function sendSms(phone, code) {
  if (!process.env.SMS_PROVIDER_URL) return { dev: DEV_SMS, code: DEV_SMS ? code : undefined };
  const response = await fetch(process.env.SMS_PROVIDER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SMS_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.SMS_PROVIDER_TOKEN}` } : {})
    },
    body: JSON.stringify({ phone, code, template: process.env.SMS_TEMPLATE_ID || "login" })
  });
  if (!response.ok) throw new Error(`短信网关返回 ${response.status}`);
  return { dev: false };
}

async function handleApi(req, res, pathname) {
  const db = await ensureDb();
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      return sendJson(res, 200, { ok: true, time: new Date().toISOString() });
    }

    if (req.method === "POST" && pathname === "/api/auth/register") {
      const { name, phone = "", password } = await readBody(req);
      if (!name || !password) return sendJson(res, 400, { error: "请填写用户名和密码" });
      if (db.users.some(user => user.name === name || (phone && user.phone === phone))) {
        return sendJson(res, 409, { error: "用户名或手机号已存在" });
      }
      const { salt, hash } = hashPassword(password);
      const user = { id: crypto.randomUUID(), name, phone, salt, passwordHash: hash, createdAt: new Date().toISOString() };
      db.users.push(user);
      const token = createSession(db, user.id);
      await saveDb(db);
      return sendJson(res, 201, { token, user: publicUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/login") {
      const { name, password } = await readBody(req);
      const user = db.users.find(item => item.name === name);
      if (!user || !verifyPassword(password || "", user)) return sendJson(res, 401, { error: "用户名或密码不正确" });
      const token = createSession(db, user.id);
      await saveDb(db);
      return sendJson(res, 200, { token, user: publicUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/sms/send") {
      const { phone } = await readBody(req);
      if (!phone) return sendJson(res, 400, { error: "请填写手机号" });
      const code = String(crypto.randomInt(100000, 999999));
      db.smsCodes = db.smsCodes.filter(item => item.expiresAt > Date.now() && item.phone !== phone);
      db.smsCodes.push({ phone, code, createdAt: Date.now(), expiresAt: Date.now() + SMS_TTL_MS });
      const sms = await sendSms(phone, code);
      await saveDb(db);
      return sendJson(res, 200, { ok: true, devCode: sms.dev ? code : undefined, message: sms.dev ? "开发模式返回验证码，生产环境请配置 SMS_PROVIDER_URL" : "验证码已发送" });
    }

    if (req.method === "POST" && pathname === "/api/auth/sms/login") {
      const { phone, code } = await readBody(req);
      const record = db.smsCodes.find(item => item.phone === phone && item.code === code && item.expiresAt > Date.now());
      if (!record) return sendJson(res, 401, { error: "验证码不正确或已过期" });
      let user = db.users.find(item => item.phone === phone);
      if (!user) {
        user = { id: crypto.randomUUID(), name: `用户${String(phone).slice(-4)}`, phone, salt: "", passwordHash: "", createdAt: new Date().toISOString() };
        db.users.push(user);
      }
      db.smsCodes = db.smsCodes.filter(item => item !== record);
      const token = createSession(db, user.id);
      await saveDb(db);
      return sendJson(res, 200, { token, user: publicUser(user) });
    }

    if (req.method === "GET" && pathname === "/api/auth/me") {
      const user = requireUser(req, db);
      if (!user) return sendJson(res, 401, { error: "未登录" });
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/logout") {
      const token = getBearer(req);
      db.sessions = db.sessions.filter(session => session.token !== token);
      await saveDb(db);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "GET" && pathname === "/api/community/posts") {
      const posts = [...db.posts, ...seedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sendJson(res, 200, { posts });
    }

    if (req.method === "POST" && pathname === "/api/community/posts") {
      const user = requireUser(req, db);
      if (!user) return sendJson(res, 401, { error: "请先登录" });
      const { title, body, tags = [] } = await readBody(req);
      if (!title || !body) return sendJson(res, 400, { error: "请填写标题和内容" });
      const post = { id: crypto.randomUUID(), author: user.name, userId: user.id, title, body, tags, createdAt: new Date().toISOString() };
      db.posts.unshift(post);
      await saveDb(db);
      return sendJson(res, 201, { post });
    }

    if (req.method === "GET" && pathname === "/api/survey/samples") {
      return sendJson(res, 200, { samples: db.samples });
    }

    if (req.method === "POST" && pathname === "/api/survey/samples") {
      const sample = await readBody(req);
      const normalized = {
        id: crypto.randomUUID(),
        age: sample.age,
        gender: sample.gender,
        region: sample.region,
        freq: Number(sample.freq || 0),
        cost: Number(sample.cost || 0),
        flavor: sample.flavor,
        alcohol: Boolean(sample.alcohol),
        tool: sample.tool,
        ingredient: sample.ingredient || "柠檬",
        createdAt: new Date().toISOString()
      };
      db.samples.push(normalized);
      await saveDb(db);
      return sendJson(res, 201, { sample: normalized, metrics: computeMetrics(db.samples) });
    }

    if (req.method === "DELETE" && pathname === "/api/survey/samples") {
      db.samples = [];
      await saveDb(db);
      return sendJson(res, 200, { ok: true, metrics: computeMetrics(db.samples) });
    }

    if (req.method === "GET" && pathname === "/api/metrics") {
      return sendJson(res, 200, computeMetrics(db.samples));
    }

    if (req.method === "POST" && pathname === "/api/chat") {
      const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) return sendJson(res, 501, { error: "未配置 AI API Key。请设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY。" });
      const body = await readBody(req);
      const provider = process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const response = await fetch(provider, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: body.model || (process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4.1-mini"),
          messages: body.messages || [],
          temperature: body.temperature ?? 0.7
        })
      });
      const data = await response.json();
      return sendJson(res, response.status, data);
    }

    return sendJson(res, 404, { error: "接口不存在" });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "服务器错误" });
  }
}

async function serveStatic(req, res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.normalize(path.join(__dirname, safePath));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error("not file");
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Content-Length": stat.size
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url.pathname);
  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, async () => {
  await ensureDb();
  console.log(`ReCheers backend running at http://localhost:${PORT}`);
});
