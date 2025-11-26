# 📋 小红书卡片生成工作流程设计

## 🔄 三步式工作流程（借鉴 RedInk）

### Step 1: 生成文案大纲 ✍️

**API:** `POST /api/cards/outline`

**输入：**
```json
{
  "topic": "秋季穿搭指南",
  "count": 6,
  "apiKey": "xxx"
}
```

**输出：**
```json
{
  "success": true,
  "data": {
    "outlineId": "outline-1234567890",
    "topic": "秋季穿搭指南",
    "cards": [
      {
        "id": "card-1",
        "order": 1,
        "title": "秋季穿搭第一课",
        "description": "温暖色调搭配技巧",
        "points": [
          "选择大地色系",
          "叠穿是关键",
          "配饰点缀"
        ]
      }
      // ... 更多卡片大纲
    ],
    "status": "draft"  // 状态：draft（草稿）
  }
}
```

**特点：**
- ✅ 只生成文案，不生成图片
- ✅ 用户可以查看和编辑
- ✅ 快速返回（3-5秒）

---

### Step 2: 用户确认/编辑 ✏️

**API:** `PUT /api/cards/outline/:id`

**输入：**
```json
{
  "cards": [
    {
      "id": "card-1",
      "order": 1,
      "title": "修改后的标题",  // 用户可以修改
      "description": "修改后的描述",
      "points": ["修改后的要点1", "修改后的要点2"]
    }
  ]
}
```

**输出：**
```json
{
  "success": true,
  "data": {
    "outlineId": "outline-1234567890",
    "status": "confirmed",  // 状态：confirmed（已确认）
    "updatedAt": "2024-11-26T00:00:00Z"
  }
}
```

**特点：**
- ✅ 用户可以修改任何内容
- ✅ 可以添加/删除卡片
- ✅ 可以调整顺序

---

### Step 3: 生成图片 🎨

**API:** `POST /api/cards/generate-images`

**输入：**
```json
{
  "outlineId": "outline-1234567890",
  "theme": "pink",  // 整体主题色
  "style": "xiaohongshu",  // 小红书风格
  "apiKey": "xxx"
}
```

**输出：**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card-1",
        "order": 1,
        "title": "秋季穿搭第一课",
        "imageUrl": "https://...generated-image-1.png",
        "generatedAt": "2024-11-26T00:00:00Z",
        "status": "completed"
      }
      // ... 更多卡片（带图片）
    ],
    "status": "completed"
  }
}
```

**特点：**
- ✅ 使用 Gemini 图片生成 API
- ✅ 根据文案内容生成图片
- ✅ 保持小红书视觉风格
- ⏱️ 较慢（每张 3-8 秒）

---

## 🎨 图片生成技术方案

### 方案一：Gemini 图片生成（推荐）

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

async function generateCardImage(
  title: string,
  description: string,
  points: string[],
  theme: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

  const prompt = `
创建一张小红书风格的内容卡片图片：

标题：${title}
描述：${description}
要点：${points.join(', ')}

设计要求：
1. 竖版 3:4 比例（1080x1440px）
2. 使用${theme}主题色
3. 小红书风格：清新、简约、emoji 点缀
4. 文字清晰易读
5. 视觉吸引力强
`

  const result = await model.generateContent([prompt])
  const imageUrl = result.response.imageUrl

  return imageUrl
}
```

### 方案二：DALL-E 3（备选）

```typescript
import OpenAI from 'openai'

async function generateCardImage(
  title: string,
  description: string,
  theme: string
): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `
Create a Xiaohongshu (Little Red Book) style content card:

Title: ${title}
Description: ${description}
Theme color: ${theme}

Style requirements:
- Portrait 3:4 ratio (1080x1440px)
- Clean and fresh design
- Include emojis
- Chinese aesthetics
- High visual appeal
`

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    size: '1024x1792',  // 接近 3:4 比例
    quality: 'hd',
    n: 1
  })

  return response.data[0].url
}
```

---

## 📊 完整流程对比

### ❌ 当前实现（一步式）

```
用户输入主题
     ↓
生成文案 + 自动渲染卡片
     ↓
用户编辑（可选）
     ↓
导出 PNG（html2canvas）
```

**问题：**
- 没有真正的 AI 图片生成
- 用户无法在生成前确认
- 视觉效果受限于 CSS

### ✅ 新设计（三步式）

```
Step 1: 用户输入主题
          ↓
      生成文案大纲
          ↓
Step 2: 用户查看、编辑、确认
          ↓
      调整顺序、修改内容
          ↓
Step 3: 根据确认的文案
          ↓
      AI 生成图片（Gemini/DALL-E）
          ↓
      完成！下载图片
```

**优势：**
- ✅ 真正的 AI 图片生成
- ✅ 用户可以充分确认
- ✅ 更好的视觉效果
- ✅ 符合小红书风格

---

## 🔧 API 设计

### 新增端点

```typescript
// 1. 生成文案大纲
POST /api/cards/outline
{
  "topic": "string",
  "count": number,
  "apiKey": "string"
}

// 2. 更新大纲
PUT /api/cards/outline/:id
{
  "cards": Card[]
}

// 3. 生成图片
POST /api/cards/generate-images
{
  "outlineId": "string",
  "theme": "string",
  "apiKey": "string"
}

// 4. 获取大纲
GET /api/cards/outline/:id

// 5. 获取生成进度（可选）
GET /api/cards/generate-images/:outlineId/progress
```

### 保留端点

```typescript
// 原有的一步式生成（向后兼容）
POST /api/cards/generate
```

---

## 💾 数据存储

### Outline 结构

```typescript
interface Outline {
  id: string
  topic: string
  status: 'draft' | 'confirmed' | 'generating' | 'completed'
  cards: OutlineCard[]
  createdAt: Date
  updatedAt: Date
  expiresAt: Date  // 24小时后过期
}

interface OutlineCard {
  id: string
  order: number
  title: string
  description: string
  points: string[]
  imageUrl?: string  // Step 3 后才有
  status?: 'pending' | 'generating' | 'completed' | 'failed'
}
```

### 存储方案

**开发环境：** 内存存储（Map）
**生产环境：** Redis / MongoDB

```typescript
// 简单的内存存储
const outlineStore = new Map<string, Outline>()

// 保存大纲
function saveOutline(outline: Outline) {
  outlineStore.set(outline.id, outline)

  // 24小时后自动清理
  setTimeout(() => {
    outlineStore.delete(outline.id)
  }, 24 * 60 * 60 * 1000)
}
```

---

## 🎯 实施优先级

### Phase 1：核心流程（必须）
- [ ] 实现三步 API
- [ ] 添加 Outline 存储
- [ ] 集成 Gemini 图片生成
- [ ] 更新前端 UI 支持三步流程

### Phase 2：优化体验（重要）
- [ ] 添加生成进度显示
- [ ] 支持单张重新生成
- [ ] 并发生成控制
- [ ] 错误重试机制

### Phase 3：高级功能（可选）
- [ ] 参考图片上传（保持风格）
- [ ] 多种图片生成模型
- [ ] 批量导出优化
- [ ] 历史记录

---

## 📈 成本估算

**Gemini 图片生成：**
- 价格：约 $0.04/张（假设）
- 6 张卡片：$0.24
- 月生成 1000 套：$240

**DALL-E 3：**
- 价格：$0.04/张（1024x1024）
- 6 张卡片：$0.24
- 月生成 1000 套：$240

**建议：** 先用 Gemini，根据效果考虑是否切换到 DALL-E 3

---

## 🚀 下一步

1. **确认技术方案** - Gemini 还是 DALL-E？
2. **实现三步 API** - 后端核心逻辑
3. **更新前端 UI** - 支持三步流程
4. **测试完整流程** - 确保体验流畅

---

**这个设计如何？是否符合你的预期？** 🤔
