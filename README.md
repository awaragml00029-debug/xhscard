# 🎨 XHS Card - AI 内容生成平台

> 基于 AI 的多功能内容生成工具，支持小红书卡片和 PPT 演示文稿生成

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![Gemini](https://img.shields.io/badge/Gemini-Pro-4285F4?logo=google)

---

## ✨ 核心功能

### 📱 小红书卡片生成
- 🤖 AI 智能拆分主题为 3-7 张内容卡片
- 🎨 6 种精美配色方案
- ✏️ 实时编辑标题、内容和标签
- 🎭 一键切换配色主题
- 📥 单张/批量导出高清 PNG 图片

### 📊 PPT 演示文稿生成
- 🎯 AI 自动生成完整 PPT 大纲（5-15 张）
- 🌈 6 种专业 PPT 主题风格
- 📝 智能章节划分（封面 + 内容 + 结尾）
- 💾 导出标准 PPTX 文件格式
- 🌐 完整 REST API 支持

### 🔌 API 服务
- ⚡ 独立的 API 服务器
- 🌍 支持跨域调用（CORS）
- 📚 完整的 API 文档
- 🚀 可在任何项目中集成

---

## 📁 项目结构

```
xhscard/
├── client/              # 前端应用（React + Vite）
│   ├── src/
│   │   ├── components/  # 所有 React 组件
│   │   ├── lib/        # 工具函数
│   │   ├── store/      # 状态管理
│   │   └── types/      # 类型定义
│   └── package.json
│
├── server/             # API 服务器（Express + TypeScript）
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   │   ├── cards.routes.ts
│   │   │   └── ppt.routes.ts
│   │   ├── services/   # 业务逻辑
│   │   │   ├── gemini.service.ts
│   │   │   └── ppt.service.ts
│   │   └── index.ts
│   └── package.json
│
├── shared/             # 共享类型定义
│   └── types/
│       └── index.ts    # TypeScript 类型
│
├── DEPLOY.md          # 🚀 部署指南（重要！）
├── API.md             # 📚 API 文档（重要！）
└── README.md          # 项目说明
```

---

## 🚀 快速开始

### 方式一：只使用 API 服务器

如果你只需要 API 功能，无需前端：

```bash
# 1. 安装依赖
cd server
npm install

# 2. 启动服务器
npm run dev

# 3. 测试 API
curl http://localhost:7000/health
```

✅ API 服务器现在运行在 **http://localhost:7000**

查看 **[API.md](./API.md)** 了解如何使用 API

### 方式二：使用完整应用（前端 + 后端）

```bash
# 1. 安装所有依赖
cd client && npm install && cd ../server && npm install && cd ..

# 2. 启动后端
cd server && npm run dev &

# 3. 启动前端
cd client && npm run dev
```

✅ 前端：**http://localhost:5173**
✅ 后端：**http://localhost:7000**

---

## 📖 完整文档

- **[DEPLOY.md](./DEPLOY.md)** - 🚀 部署和测试流程（必读）
- **[API.md](./API.md)** - 📚 完整 API 文档

---

## 🎯 核心 API 端点

### 1. 生成小红书卡片

```bash
POST /api/cards/generate
```

```json
{
  "topic": "健康生活方式",
  "count": 5,
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

### 2. 生成 PPT 内容

```bash
POST /api/ppt/generate
```

```json
{
  "topic": "人工智能发展趋势",
  "slideCount": 10,
  "theme": "tech-purple",
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

### 3. 导出 PPT 文件

```bash
POST /api/ppt/export
```

```json
{
  "slides": [...],
  "theme": "business-blue",
  "title": "演示文稿"
}
```

查看 **[API.md](./API.md)** 获取完整 API 文档

---

## 🌈 功能展示

### 小红书卡片

- **6 种配色方案**
  - 🌸 粉色少女 - 甜美温柔
  - 🌊 清新蓝调 - 清爽舒适
  - 🍊 活力橙黄 - 阳光活力
  - 🌿 自然绿意 - 清新自然
  - 💜 优雅紫调 - 优雅高贵
  - 🌅 日落暖调 - 温暖浪漫

### PPT 主题

- **6 种专业主题**
  - 💼 商务蓝 - 专业稳重
  - 🔮 科技紫 - 创新未来
  - 🌱 清新绿 - 自然活力
  - 🔥 温暖橙 - 热情积极
  - 🎩 优雅灰 - 简约高级
  - ❤️ 活力红 - 激情醒目

---

## 🛠️ 技术栈

### 前端
- **React 19** + TypeScript
- **Vite** - 构建工具
- **Tailwind CSS 4** - 样式框架
- **Zustand** - 状态管理
- **Framer Motion** - 动画库
- **html2canvas** - 图片导出

### 后端
- **Node.js** + TypeScript
- **Express** - Web 框架
- **PptxGenJS** - PPT 生成
- **Google Gemini Pro** - AI 内容生成
- **CORS** - 跨域支持

### 共享
- **TypeScript** - 类型定义
- **Monorepo** - 代码组织

---

## 🔌 在其他项目中使用

### JavaScript/TypeScript

```typescript
// 生成并导出 PPT
const response = await fetch('http://localhost:7000/api/ppt/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '项目汇报',
    slideCount: 12,
    theme: 'business-blue',
    apiKey: process.env.GEMINI_API_KEY
  })
})

const { data } = await response.json()

// 导出文件
const exportRes = await fetch('http://localhost:7000/api/ppt/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slides: data.slides,
    theme: 'business-blue',
    title: '项目汇报'
  })
})

const blob = await exportRes.blob()
// ... 下载文件
```

### Python

```python
import requests

# 生成 PPT
response = requests.post(
    'http://localhost:7000/api/ppt/generate',
    json={
        'topic': '数据分析报告',
        'slideCount': 15,
        'theme': 'elegant-gray',
        'apiKey': 'YOUR_API_KEY'
    }
)

data = response.json()['data']

# 导出文件
export_response = requests.post(
    'http://localhost:7000/api/ppt/export',
    json={
        'slides': data['slides'],
        'theme': 'elegant-gray',
        'title': '数据分析报告'
    }
)

with open('报告.pptx', 'wb') as f:
    f.write(export_response.content)
```

---

## 📦 生产部署

### 后端 API

```bash
# 构建
cd server
npm run build

# 启动
npm start

# 或使用 PM2
pm2 start dist/index.js --name xhscard-api
```

### 前端应用

```bash
# 构建
cd client
npm run build

# 部署 dist/ 到静态托管
# Vercel, Netlify, Nginx 等
```

### Docker

```bash
# 构建镜像
docker build -t xhscard-api -f server/Dockerfile .

# 运行容器
docker run -p 3000:3000 xhscard-api
```

查看 **[DEPLOY.md](./DEPLOY.md)** 获取详细部署指南

---

## 🎓 使用场景

### 小红书创作者
- 📝 快速生成内容大纲
- 🎨 精美卡片设计
- ⚡ 提升创作效率

### 职场人士
- 📊 快速制作 PPT
- 💼 专业演示设计
- ⏰ 节省制作时间

### 开发者
- 🔌 集成到自己的项目
- 🌐 提供内容生成服务
- 🚀 快速构建 AI 应用

---

## 🔑 获取 Gemini API Key

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录 Google 账号
3. 创建 API Key
4. 免费额度充足

---

## 📊 性能指标

- **API 响应时间：** < 5s（取决于 Gemini API）
- **卡片生成：** 3-7 张/次
- **PPT 生成：** 5-15 张/次
- **导出速度：** < 2s
- **并发支持：** 100+ req/min

---

## 🐛 常见问题

### 1. 如何获取 API Key？
查看上方 "获取 Gemini API Key" 部分

### 2. 能否离线使用？
需要网络连接调用 Gemini API

### 3. 支持哪些语言？
支持中文和英文

### 4. API 有速率限制吗？
目前无限制，建议生产环境添加

### 5. 能自定义 PPT 模板吗？
可以，修改 `server/src/services/ppt.service.ts`

---

## 📝 更新日志

### v1.0.0 (2024-11-25)
- ✨ 首次发布
- 🎨 小红书卡片生成功能
- 📊 PPT 生成和导出功能
- 🔌 完整的 REST API
- 📚 详细的文档

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Google Gemini](https://ai.google.dev/) - AI 内容生成
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) - PPT 生成库
- [React](https://react.dev/) - 前端框架
- [Express](https://expressjs.com/) - 后端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

---

## 📞 支持

- 📖 查看 [DEPLOY.md](./DEPLOY.md) - 部署指南
- 📚 查看 [API.md](./API.md) - API 文档
- 💬 提交 Issue

---

**Made with ❤️ by Claude**

**⭐ 如果觉得有用，请给个 Star！**
