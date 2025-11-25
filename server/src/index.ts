import express from 'express'
import cors from 'cors'
import cardsRoutes from './routes/cards.routes.js'
import pptRoutes from './routes/ppt.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

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
   POST http://localhost:${PORT}/api/cards/generate
   POST http://localhost:${PORT}/api/ppt/generate
   POST http://localhost:${PORT}/api/ppt/export
   GET  http://localhost:${PORT}/api/ppt/themes

✨ Ready to serve!
  `)
})

export default app
