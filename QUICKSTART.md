# ⚡ 快速开始指南

## 🎯 3 分钟快速测试

### 准备工作

1. **获取 Gemini API Key**
   - 访问：https://ai.google.dev/
   - 登录并创建 API Key（免费）
   - 复制 Key 备用

2. **确保环境**
   - Node.js >= 18.0.0
   - npm >= 9.0.0

---

## 🚀 方式一：只测试 API（推荐）

### 步骤 1：安装依赖

```bash
cd /home/user/xhscard/server
npm install
```

### 步骤 2：启动服务器

```bash
npm run dev
```

**✅ 看到以下输出表示启动成功：**
```
🚀 XHS Card API Server is running!
📍 Server: http://localhost:7000
✨ Ready to serve!
```

### 步骤 3：测试 API（在新终端）

#### 测试 1：健康检查

```bash
curl http://localhost:7000/health
```

**预期响应：**
```json
{
  "status": "ok",
  "message": "XHS Card API Server is running"
}
```

#### 测试 2：生成小红书卡片

```bash
curl -X POST http://localhost:7000/api/cards/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "冬季护肤指南",
    "count": 5,
    "apiKey": "YOUR_GEMINI_API_KEY_HERE"
  }' | json_pp
```

**替换 `YOUR_GEMINI_API_KEY_HERE` 为你的真实 API Key**

**预期响应：**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "card-...",
        "title": "冬季护肤第一步",
        "content": "📍 保湿是关键\n✨ 选择温和产品\n💡 注意防晒",
        "tags": ["护肤", "冬季", "保湿"],
        "theme": "pink",
        "order": 1
      }
      // ... 更多卡片
    ]
  }
}
```

#### 测试 3：生成 PPT

```bash
curl -X POST http://localhost:7000/api/ppt/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI 发展趋势",
    "slideCount": 8,
    "theme": "tech-purple",
    "apiKey": "YOUR_GEMINI_API_KEY_HERE"
  }' | json_pp
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": "slide-...",
        "type": "cover",
        "title": "AI 发展趋势",
        "content": ["探索人工智能的未来"],
        "theme": "tech-purple",
        "order": 1
      }
      // ... 更多幻灯片
    ]
  }
}
```

#### 测试 4：导出 PPT 文件

```bash
# 1. 先保存上一步的 slides 到文件
# 2. 然后导出
curl -X POST http://localhost:7000/api/ppt/export \
  -H "Content-Type: application/json" \
  -d @request.json \
  --output my_presentation.pptx
```

**request.json 示例：**
```json
{
  "slides": [ /* 从生成 API 获取的 slides */ ],
  "theme": "tech-purple",
  "title": "AI 发展趋势"
}
```

#### 测试 5：获取主题列表

```bash
curl http://localhost:7000/api/ppt/themes | json_pp
```

**预期响应：**
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
      }
      // ... 更多主题
    ]
  }
}
```

---

## 🖥️ 方式二：使用完整应用（前端 + 后端）

### 步骤 1：安装所有依赖

```bash
# 安装 server 依赖
cd /home/user/xhscard/server
npm install

# 安装 client 依赖
cd /home/user/xhscard/client
npm install
```

### 步骤 2：启动后端

```bash
cd /home/user/xhscard/server
npm run dev
```

### 步骤 3：启动前端（新终端）

```bash
cd /home/user/xhscard/client
npm run dev
```

### 步骤 4：访问应用

打开浏览器访问：**http://localhost:5173**

---

## 🔧 常见问题

### 1. 端口被占用

**问题：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决：**
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或修改端口
export PORT=3001
npm run dev
```

### 2. API Key 错误

**问题：** `生成卡片失败: API key not valid`

**解决：**
- 确认 API Key 正确
- 检查 API Key 是否有效
- 访问 https://ai.google.dev/ 重新创建

### 3. 网络错误

**问题：** `Failed to fetch`

**解决：**
- 检查网络连接
- 确认可以访问 Google API
- 可能需要配置代理

### 4. TypeScript 编译错误

**问题：** `TS2307: Cannot find module`

**解决：**
```bash
cd /home/user/xhscard/server
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 API 响应时间

| API | 预期时间 |
|-----|---------|
| 健康检查 | < 10ms |
| 生成卡片 | 3-8s（取决于 Gemini API） |
| 生成 PPT | 5-15s（取决于幻灯片数量） |
| 导出 PPT | < 2s |
| 获取主题 | < 10ms |

---

## 🎉 成功测试的标志

如果你看到：
- ✅ 服务器启动成功（端口 3000）
- ✅ 健康检查返回 `status: ok`
- ✅ 成功生成卡片或 PPT
- ✅ 可以导出 PPTX 文件

**恭喜！你已经成功运行了 XHS Card API！** 🎊

---

## 📚 下一步

- 查看 [API.md](./API.md) 了解完整 API 文档
- 查看 [DEPLOY.md](./DEPLOY.md) 了解生产部署
- 查看 [README.md](./README.md) 了解项目详情

---

## 💡 集成到你的项目

现在 API 已经运行，你可以在任何项目中调用：

**JavaScript:**
```javascript
const response = await fetch('http://localhost:7000/api/ppt/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: '你的主题',
    slideCount: 10,
    theme: 'business-blue',
    apiKey: 'YOUR_API_KEY'
  })
})
```

**Python:**
```python
import requests

response = requests.post(
    'http://localhost:7000/api/ppt/generate',
    json={
        'topic': '你的主题',
        'slideCount': 10,
        'theme': 'business-blue',
        'apiKey': 'YOUR_API_KEY'
    }
)
```

---

**祝你使用愉快！** 🚀
