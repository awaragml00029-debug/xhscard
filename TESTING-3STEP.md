# 🧪 三步式卡片生成流程测试指南

## 📋 概述

这个测试指南演示如何使用新的三步式 API 生成小红书风格的卡片图片。

## 🔑 准备工作

### 获取 API Keys

你需要以下之一的 API Key：

1. **Gemini API Key**（推荐 - 一站式解决方案 ⭐）
   - 访问：https://ai.google.dev/
   - 创建免费 API Key
   - **Step 1**: 生成文案大纲
   - **Step 3**: 生成图片（使用 Gemini 2.0 Flash "Nano Banana"）
   - 价格：$0.03/张（比 DALL-E 3 便宜 25%）
   - **推荐使用！**

2. **OpenAI API Key**（备选 - 高质量）
   - 访问：https://platform.openai.com/
   - 创建 API Key（需要付费账户）
   - 用于使用 DALL-E 3 生成图片
   - 价格：$0.04/张

3. **占位符模式**（免费测试）
   - 不需要任何 API Key
   - 系统会自动使用占位符图片
   - 适合测试流程

### 启动服务器

```bash
cd /home/user/xhscard/server
npm run dev
```

看到以下输出表示启动成功：
```
🚀 XHS Card API Server is running!
📍 Server: http://localhost:7000
```

---

## 🎯 完整的三步流程测试

### Step 1: 生成文案大纲 ✍️

**API:** `POST /api/cards/outline`

```bash
curl -X POST http://localhost:7000/api/cards/outline \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "秋季穿搭指南",
    "count": 6,
    "apiKey": "YOUR_GEMINI_API_KEY_HERE"
  }' | json_pp
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "outlineId": "outline-1732579200000-abc123",
    "topic": "秋季穿搭指南",
    "cards": [
      {
        "id": "card-1732579200000-0",
        "order": 1,
        "title": "秋季穿搭第一课",
        "description": "温暖色调搭配技巧",
        "points": [
          "📍 选择大地色系",
          "✨ 叠穿是关键",
          "💡 配饰点缀"
        ]
      }
      // ... 更多卡片
    ],
    "status": "draft"
  }
}
```

**📝 记下返回的 `outlineId`，后续步骤需要使用！**

---

### Step 2: 查看和编辑大纲 ✏️

#### 2.1 查看大纲

**API:** `GET /api/cards/outline/:id`

```bash
curl http://localhost:7000/api/cards/outline/outline-1732579200000-abc123 | json_pp
```

#### 2.2 编辑大纲（可选）

**API:** `PUT /api/cards/outline/:id`

你可以修改：
- 标题 (title)
- 描述 (description)
- 要点 (points)
- 顺序 (order)
- 添加/删除卡片

```bash
curl -X PUT http://localhost:7000/api/cards/outline/outline-1732579200000-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [
      {
        "id": "card-1732579200000-0",
        "order": 1,
        "title": "修改后的标题 - 秋季穿搭第一课",
        "description": "温暖色调搭配技巧（已编辑）",
        "points": [
          "📍 选择大地色系",
          "✨ 叠穿是关键",
          "💡 配饰点缀",
          "🎨 添加新要点"
        ]
      }
      // ... 其他卡片（保持不变或修改）
    ]
  }' | json_pp
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "outlineId": "outline-1732579200000-abc123",
    "status": "confirmed",
    "updatedAt": "2024-11-26T00:00:00.000Z"
  }
}
```

---

### Step 3: 生成图片 🎨

**API:** `POST /api/cards/generate-images`

#### 3.1 使用 Gemini 生成真实图片（推荐 ⭐）

```bash
curl -X POST http://localhost:7000/api/cards/generate-images \
  -H "Content-Type: application/json" \
  -d '{
    "outlineId": "outline-1732579200000-abc123",
    "theme": "pink",
    "style": "xiaohongshu",
    "apiKey": "YOUR_GEMINI_API_KEY_HERE"
  }' | json_pp
```

**优势：**
- ✅ 使用 Gemini 2.0 Flash（代号 "Nano Banana"）
- ✅ 价格便宜：$0.03/张
- ✅ 质量优秀，符合小红书风格
- ✅ 一个 API Key 完成所有步骤

#### 3.2 使用 DALL-E 3 生成真实图片（备选）

```bash
curl -X POST http://localhost:7000/api/cards/generate-images \
  -H "Content-Type: application/json" \
  -d '{
    "outlineId": "outline-1732579200000-abc123",
    "theme": "pink",
    "style": "xiaohongshu",
    "apiKey": "sk-YOUR_OPENAI_API_KEY_HERE"
  }' | json_pp
```

#### 3.3 使用占位符图片（免费测试）

```bash
curl -X POST http://localhost:7000/api/cards/generate-images \
  -H "Content-Type: application/json" \
  -d '{
    "outlineId": "outline-1732579200000-abc123",
    "theme": "pink",
    "style": "xiaohongshu"
  }' | json_pp
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card-1732579200000-0",
        "order": 1,
        "title": "秋季穿搭第一课",
        "description": "温暖色调搭配技巧",
        "points": ["📍 选择大地色系", "✨ 叠穿是关键", "💡 配饰点缀"],
        "imageUrl": "https://via.placeholder.com/1080x1440/...",
        "status": "completed"
      }
      // ... 更多带图片的卡片
    ],
    "status": "completed"
  }
}
```

---

## 🎭 主题和风格选项

### 可用主题 (theme)

- `pink` - 粉色少女系（默认）
- `blue` - 清新蓝调
- `orange` - 活力橙黄
- `green` - 自然绿意
- `purple` - 优雅紫调
- `sunset` - 日落暖调

### 风格 (style)

- `xiaohongshu` - 小红书风格（默认）

---

## 📊 完整示例脚本

保存为 `test-3step.sh`:

```bash
#!/bin/bash

# 配置
GEMINI_KEY="YOUR_GEMINI_API_KEY"
OPENAI_KEY="YOUR_OPENAI_API_KEY"  # 可选，没有则使用占位符
TOPIC="秋季护肤小技巧"
COUNT=5

echo "🎨 开始测试三步式卡片生成流程"
echo "======================================"

# Step 1: 生成大纲
echo ""
echo "📝 Step 1: 生成文案大纲..."
OUTLINE_RESPONSE=$(curl -s -X POST http://localhost:7000/api/cards/outline \
  -H "Content-Type: application/json" \
  -d "{
    \"topic\": \"$TOPIC\",
    \"count\": $COUNT,
    \"apiKey\": \"$GEMINI_KEY\"
  }")

echo "$OUTLINE_RESPONSE" | json_pp

# 提取 outlineId
OUTLINE_ID=$(echo "$OUTLINE_RESPONSE" | grep -o '"outlineId":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "✅ 大纲 ID: $OUTLINE_ID"

# Step 2: 查看大纲
echo ""
echo "📖 Step 2: 查看大纲..."
sleep 2
curl -s http://localhost:7000/api/cards/outline/$OUTLINE_ID | json_pp

# Step 3: 生成图片
echo ""
echo "🎨 Step 3: 生成图片..."
sleep 2

if [ -n "$OPENAI_KEY" ]; then
  echo "使用 DALL-E 3 生成真实图片..."
  curl -s -X POST http://localhost:7000/api/cards/generate-images \
    -H "Content-Type: application/json" \
    -d "{
      \"outlineId\": \"$OUTLINE_ID\",
      \"theme\": \"pink\",
      \"style\": \"xiaohongshu\",
      \"apiKey\": \"$OPENAI_KEY\"
    }" | json_pp
else
  echo "使用占位符图片..."
  curl -s -X POST http://localhost:7000/api/cards/generate-images \
    -H "Content-Type: application/json" \
    -d "{
      \"outlineId\": \"$OUTLINE_ID\",
      \"theme\": \"pink\",
      \"style\": \"xiaohongshu\"
    }" | json_pp
fi

echo ""
echo "======================================"
echo "✅ 测试完成！"
```

使用方法：
```bash
chmod +x test-3step.sh
./test-3step.sh
```

---

## ⚠️ 注意事项

### Step 1 失败
- **错误：** `生成大纲失败: API key not valid`
- **解决：** 检查 Gemini API Key 是否正确

### Step 2 失败
- **错误：** `大纲不存在或已过期`
- **原因：** 大纲 24 小时后自动过期
- **解决：** 重新执行 Step 1

### Step 3 失败（使用 DALL-E 3）
- **错误：** `DALL-E 3 API 错误`
- **原因：** OpenAI API Key 无效或余额不足
- **解决：** 检查 API Key 或使用占位符模式

### 占位符模式
- 不需要 OpenAI API Key
- 返回 placeholder 图片 URL
- 适合测试流程

---

## 💰 成本估算

### Gemini API（Step 1）
- **免费额度：** 每分钟 60 次请求
- **价格：** 免费（有限额）

### DALL-E 3（Step 3）
- **价格：** ~$0.04/张（1024x1024）
- **6 张卡片：** ~$0.24
- **月生成 100 套：** ~$24

### 占位符模式
- **价格：** 完全免费

---

## 🔄 流程对比

### ❌ 旧的一步式流程
```
用户输入 → 生成文案 → 自动渲染 → 导出 PNG
```
**问题：**
- 无法预览和修改
- 不是真实的 AI 图片
- 用户体验差

### ✅ 新的三步式流程
```
Step 1: 生成大纲
   ↓
Step 2: 用户确认/编辑
   ↓
Step 3: AI 生成图片
```
**优势：**
- 用户可以预览和修改
- 真实的 AI 图片生成
- 更好的用户体验

---

## 📚 下一步

- 查看 [API.md](./API.md) 了解完整 API 文档
- 查看 [WORKFLOW.md](./WORKFLOW.md) 了解设计思路
- 查看 [QUICKSTART.md](./QUICKSTART.md) 快速开始

---

**祝测试愉快！** 🎉
