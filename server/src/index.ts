import express from 'express'
import cors from 'cors'
import cardsRoutes from './routes/cards.routes.js'
import outlineRoutes from './routes/outline.routes.js'
import pptRoutes from './routes/ppt.routes.js'

const app = express()
const PORT = process.env.PORT || 7000

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'XHS Card API Server is running' })
})

// API 路由
app.use('/api/cards', cardsRoutes)
app.use('/api/cards', outlineRoutes)  // 三步式卡片生成流程
app.use('/api/ppt', pptRoutes)

// 404 处理
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  })
})

// 错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
🚀 XHS Card API Server is running!

📍 Server: http://localhost:${PORT}
📍 Health: http://localhost:${PORT}/health

📚 API Endpoints:

   🎨 小红书卡片（一步式 - 向后兼容）:
   POST http://localhost:${PORT}/api/cards/generate

   🎨 小红书卡片（三步式 - 推荐）:
   POST http://localhost:${PORT}/api/cards/outline          (Step 1: 生成大纲)
   GET  http://localhost:${PORT}/api/cards/outline/:id      (获取大纲)
   PUT  http://localhost:${PORT}/api/cards/outline/:id      (Step 2: 编辑大纲)
   POST http://localhost:${PORT}/api/cards/generate-images  (Step 3: 生成图片)

   📊 PPT 生成:
   POST http://localhost:${PORT}/api/ppt/generate
   POST http://localhost:${PORT}/api/ppt/export
   GET  http://localhost:${PORT}/api/ppt/themes

✨ Ready to serve!
  `)
})

export default app
