# 🚀 快速部署测试流程

## 📋 前置要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Gemini API Key**: 从 [https://ai.google.dev/](https://ai.google.dev/) 获取

---

## ⚡ 快速开始（3 步上手）

### 第 1 步：安装所有依赖

```bash
# 1. 进入项目根目录
cd /home/user/xhscard

# 2. 安装 client 依赖
cd client && npm install && cd ..

# 3. 安装 server 依赖
cd server && npm install && cd ..
```

###第 2 步：启动 API 服务器

```bash
# 进入 server 目录
cd server

# 启动开发服务器
npm run dev
```

服务器将在 **http://localhost:3000** 启动

### 第 3 步：测试 API

```bash
# 健康检查
curl http://localhost:3000/health

# 测试卡片生成（替换YOUR_API_KEY）
curl -X POST http://localhost:3000/api/cards/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "夏日穿搭指南",
    "count": 5,
    "apiKey": "YOUR_GEMINI_API_KEY"
  }'

# 测试 PPT 生成
curl -X POST http://localhost:3000/api/ppt/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "人工智能发展趋势",
    "slideCount": 8,
    "theme": "business-blue",
    "apiKey": "YOUR_GEMINI_API_KEY"
  }'

# 获取 PPT 主题列表
curl http://localhost:3000/api/ppt/themes
```

---

## 🖥️ 启动前端（可选）

如果你想使用完整的前端界面：

```bash
# 进入 client 目录
cd client

# 启动开发服务器
npm run dev
```

前端将在 **http://localhost:5173** 启动

---

## 📦 生产部署

### 方案一：分别部署（推荐）

**后端 API 服务器：**

```bash
# 1. 构建
cd server
npm run build

# 2. 启动
npm start

# 3. 或使用 PM2
pm2 start dist/index.js --name xhscard-api
```

**前端应用：**

```bash
# 1. 构建
cd client
npm run build

# 2. 部署 dist/ 目录到静态托管服务
# 如：Vercel, Netlify, Nginx 等
```

### 方案二：Docker 部署

```dockerfile
# Dockerfile 示例（服务器）
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --production

COPY server/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t xhscard-api .

# 运行容器
docker run -p 3000:3000 xhscard-api
```

---

## 🔧 环境变量配置

在 `server/` 目录创建 `.env` 文件：

```env
PORT=3000
NODE_ENV=production
```

---

## 🧪 API 测试示例（Postman/Insomnia）

### 1. 生成小红书卡片

**POST** `http://localhost:3000/api/cards/generate`

**Body (JSON):**
```json
{
  "topic": "秋季护肤指南",
  "count": 6,
  "apiKey": "your-gemini-api-key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card-1234567890-0",
        "title": "秋季护肤第一步",
        "content": "📍 补水保湿是关键\n✨ 选择温和的洁面产品\n💡 早晚使用保湿精华",
        "tags": ["护肤", "秋季", "保湿"],
        "theme": "pink",
        "order": 1
      }
    ]
  }
}
```

### 2. 生成 PPT

**POST** `http://localhost:3000/api/ppt/generate`

**Body (JSON):**
```json
{
  "topic": "产品发布会策划",
  "slideCount": 10,
  "theme": "tech-purple",
  "language": "zh",
  "apiKey": "your-gemini-api-key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": "slide-1234567890-0",
        "type": "cover",
        "title": "产品发布会策划",
        "content": ["创新科技，引领未来"],
        "theme": "tech-purple",
        "order": 1
      }
    ]
  }
}
```

### 3. 导出 PPT 文件

**POST** `http://localhost:3000/api/ppt/export`

**Body (JSON):**
```json
{
  "slides": [...],  // 之前生成的 slides 数组
  "theme": "business-blue",
  "title": "我的演示文稿"
}
```

**Response:** 直接下载 PPTX 文件

---

## 🌐 在其他项目中调用 API

### JavaScript/TypeScript

```typescript
// 生成卡片
const response = await fetch('http://localhost:3000/api/cards/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '健康饮食建议',
    count: 5,
    apiKey: process.env.GEMINI_API_KEY
  })
})

const { data } = await response.json()
console.log(data.cards)

// 生成并导出 PPT
const pptResponse = await fetch('http://localhost:3000/api/ppt/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '年度总结报告',
    slideCount: 12,
    theme: 'elegant-gray',
    apiKey: process.env.GEMINI_API_KEY
  })
})

const { data: pptData } = await pptResponse.json()

// 导出为文件
const exportResponse = await fetch('http://localhost:3000/api/ppt/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slides: pptData.slides,
    theme: 'elegant-gray',
    title: '年度总结报告'
  })
})

const blob = await exportResponse.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = '年度总结.pptx'
a.click()
```

### Python

```python
import requests

# 生成 PPT
response = requests.post(
    'http://localhost:3000/api/ppt/generate',
    json={
        'topic': '机器学习入门',
        'slideCount': 15,
        'theme': 'tech-purple',
        'apiKey': 'your-gemini-api-key'
    }
)

data = response.json()
slides = data['data']['slides']

# 导出 PPT
export_response = requests.post(
    'http://localhost:3000/api/ppt/export',
    json={
        'slides': slides,
        'theme': 'tech-purple',
        'title': '机器学习入门'
    }
)

with open('机器学习入门.pptx', 'wb') as f:
    f.write(export_response.content)
```

---

## 🐛 常见问题

### 1. 端口被占用

```bash
# 修改 server/.env
PORT=3001
```

### 2. TypeScript 编译错误

```bash
# 清理并重新安装
cd server
rm -rf node_modules package-lock.json
npm install
```

### 3. Gemini API 错误

- 确认 API Key 有效
- 检查网络连接
- 查看 API 配额限制

### 4. CORS 错误

服务器已配置 CORS，如需自定义：

```typescript
// server/src/index.ts
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com']
}))
```

---

## 📊 性能优化

### 1. API 响应缓存

```typescript
// 使用 Redis 缓存生成结果
import Redis from 'ioredis'
const redis = new Redis()

// 缓存 PPT 主题列表
router.get('/themes', async (req, res) => {
  const cached = await redis.get('ppt:themes')
  if (cached) {
    return res.json(JSON.parse(cached))
  }
  // ... 生成并缓存
})
```

### 2. 限流

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 最多 100 次请求
})

app.use('/api/', limiter)
```

---

## 📈 监控和日志

```typescript
// 添加请求日志
import morgan from 'morgan'
app.use(morgan('combined'))

// 错误追踪
import * as Sentry from '@sentry/node'
Sentry.init({ dsn: 'your-dsn' })
```

---

## 🎉 完成！

现在你可以：
- ✅ 使用 API 生成小红书卡片
- ✅ 使用 API 生成 PPT
- ✅ 在任何项目中调用 API
- ✅ 部署到生产环境

有问题？查看 [API.md](./API.md) 获取完整 API 文档。
