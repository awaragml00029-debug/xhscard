# 📚 API 完整文档

## 基础信息

**Base URL:** `http://localhost:3000/api`

**Content-Type:** `application/json`

**Authentication:** API Key in request body

---

## 📍 API 端点概览

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/cards/generate` | 生成小红书卡片 |
| POST | `/ppt/generate` | 生成 PPT 内容 |
| POST | `/ppt/export` | 导出 PPT 文件 |
| GET | `/ppt/themes` | 获取 PPT 主题列表 |

---

## 1️⃣ 健康检查

### `GET /health`

检查 API 服务器状态。

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "XHS Card API Server is running"
}
```

---

## 2️⃣ 生成小红书卡片

### `POST /api/cards/generate`

根据主题生成 3-7 张小红书风格的内容卡片。

**Request Body:**

| 字段 | 类型 | 必填 | 描述 | 默认值 |
|------|------|------|------|--------|
| `topic` | string | ✅ | 主题内容 | - |
| `count` | number | ❌ | 卡片数量（3-7） | 5 |
| `apiKey` | string | ✅ | Gemini API Key | - |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/cards/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "秋季穿搭技巧",
    "count": 6,
    "apiKey": "YOUR_API_KEY"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card-1701234567890-0",
        "title": "秋季穿搭第一课",
        "content": "📍 选择温暖的色调\n✨ 叠穿是关键\n💡 配饰点缀整体",
        "tags": ["穿搭", "秋季", "时尚"],
        "theme": "pink",
        "order": 1
      },
      {
        "id": "card-1701234567890-1",
        "title": "必备单品推荐",
        "content": "🧥 风衣外套\n👔 针织衫\n👖 阔腿裤",
        "tags": ["单品", "推荐", "秋装"],
        "theme": "blue",
        "order": 2
      }
      // ... more cards
    ]
  }
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "请提供主题" // 或其他错误信息
}
```

**卡片主题色:**

- `pink` - 粉色少女系
- `blue` - 清新蓝调
- `orange` - 活力橙黄
- `green` - 自然绿意
- `purple` - 优雅紫调
- `sunset` - 日落暖调

---

## 3️⃣ 生成 PPT 内容

### `POST /api/ppt/generate`

根据主题生成完整的 PPT 演示文稿大纲（5-15 张幻灯片）。

**Request Body:**

| 字段 | 类型 | 必填 | 描述 | 默认值 |
|------|------|------|------|--------|
| `topic` | string | ✅ | 演示主题 | - |
| `slideCount` | number | ❌ | 幻灯片数量（5-15） | 8 |
| `theme` | string | ❌ | PPT 主题 | business-blue |
| `language` | string | ❌ | 语言（zh/en） | zh |
| `apiKey` | string | ✅ | Gemini API Key | - |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/ppt/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "数字化转型策略",
    "slideCount": 10,
    "theme": "tech-purple",
    "language": "zh",
    "apiKey": "YOUR_API_KEY"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": "slide-1701234567890-0",
        "type": "cover",
        "title": "数字化转型策略",
        "content": ["引领企业创新发展"],
        "notes": "欢迎大家参加本次分享",
        "theme": "tech-purple",
        "order": 1
      },
      {
        "id": "slide-1701234567890-1",
        "type": "content",
        "title": "什么是数字化转型",
        "content": [
          "利用数字技术改造业务流程",
          "提升客户体验和运营效率",
          "创造新的商业模式"
        ],
        "notes": "强调数字化转型的重要性",
        "theme": "tech-purple",
        "order": 2
      },
      {
        "id": "slide-1701234567890-9",
        "type": "ending",
        "title": "感谢聆听",
        "content": ["期待与您共同探索数字化未来"],
        "theme": "tech-purple",
        "order": 10
      }
      // ... more slides
    ]
  }
}
```

**Slide Types:**

- `cover` - 封面页（第1张）
- `content` - 内容页（主体部分）
- `ending` - 结束页（最后1张）

**PPT Themes:**

- `business-blue` - 商务蓝（专业、稳重）
- `tech-purple` - 科技紫（创新、未来）
- `fresh-green` - 清新绿（自然、活力）
- `warm-orange` - 温暖橙（热情、积极）
- `elegant-gray` - 优雅灰（简约、高级）
- `vibrant-red` - 活力红（激情、醒目）

---

## 4️⃣ 导出 PPT 文件

### `POST /api/ppt/export`

将生成的幻灯片内容导出为 PPTX 文件。

**Request Body:**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `slides` | array | ✅ | 幻灯片数组（来自 /ppt/generate） |
| `theme` | string | ✅ | PPT 主题 |
| `title` | string | ✅ | 演示文稿标题 |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/ppt/export \
  -H "Content-Type: application/json" \
  -d '{
    "slides": [...],
    "theme": "business-blue",
    "title": "产品发布会"
  }' \
  --output presentation.pptx
```

**Success Response (200):**

- **Content-Type:** `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- **Content-Disposition:** `attachment; filename="产品发布会_1701234567890.pptx"`
- **Body:** PPTX 文件二进制数据

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "请提供幻灯片内容"
}
```

---

## 5️⃣ 获取 PPT 主题列表

### `GET /api/ppt/themes`

获取所有可用的 PPT 主题配置。

**Request:**

```bash
curl http://localhost:3000/api/ppt/themes
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "themes": [
      {
        "name": "商务蓝",
        "primary": "0B5394",
        "secondary": "3C78D8",
        "background": "FFFFFF",
        "textColor": "1C1C1C",
        "accentColor": "0B5394"
      },
      {
        "name": "科技紫",
        "primary": "6A1B9A",
        "secondary": "9C27B0",
        "background": "F3E5F5",
        "textColor": "1A1A1A",
        "accentColor": "AB47BC"
      }
      // ... more themes
    ]
  }
}
```

---

## 🔐 错误码说明

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | API 端点不存在 |
| 500 | 服务器内部错误 |

**Error Response Format:**

```json
{
  "success": false,
  "error": "错误描述信息"
}
```

---

## 💡 使用示例

### 完整流程：生成并导出 PPT

```typescript
// Step 1: 生成 PPT 内容
const generateResponse = await fetch('http://localhost:3000/api/ppt/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '年度工作总结',
    slideCount: 12,
    theme: 'business-blue',
    apiKey: process.env.GEMINI_API_KEY
  })
})

const { data } = await generateResponse.json()
const slides = data.slides

// Step 2: 可选 - 编辑 slides
slides[0].title = '2024年度工作总结'  // 修改封面标题
slides[1].content.push('新增的要点')   // 添加内容

// Step 3: 导出为 PPTX 文件
const exportResponse = await fetch('http://localhost:3000/api/ppt/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slides: slides,
    theme: 'business-blue',
    title: '2024年度工作总结'
  })
})

const blob = await exportResponse.blob()

// Step 4: 下载文件
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = '年度总结.pptx'
a.click()
URL.revokeObjectURL(url)
```

### 批量生成多个 PPT

```typescript
const topics = [
  '产品规划',
  '市场分析',
  '竞争对手研究'
]

for (const topic of topics) {
  // 生成内容
  const response = await fetch('http://localhost:3000/api/ppt/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic,
      slideCount: 8,
      theme: 'tech-purple',
      apiKey: process.env.GEMINI_API_KEY
    })
  })

  const { data } = await response.json()

  // 导出文件
  const exportResponse = await fetch('http://localhost:3000/api/ppt/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slides: data.slides,
      theme: 'tech-purple',
      title: topic
    })
  })

  // 保存文件...
}
```

---

## 📊 速率限制

目前未实施速率限制，生产环境建议添加：

- **建议限制：** 100 requests / 15 minutes per IP
- **实现方式：** express-rate-limit

---

## 🔄 版本历史

### v1.0.0 (2024-11-25)
- ✨ 首次发布
- 🎯 支持小红书卡片生成
- 🎯 支持 PPT 生成和导出
- 🎨 6 种PPT主题
- 🌐 完整的 REST API

---

## 📞 技术支持

遇到问题？

1. 查看 [DEPLOY.md](./DEPLOY.md) 部署指南
2. 查看 [README.md](./README.md) 项目文档
3. 提交 Issue

---

Made with ❤️ by Claude
