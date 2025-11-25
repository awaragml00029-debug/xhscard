import { Router } from 'express'
import { initializeGemini, generateCards } from '../services/gemini.service.js'
import type {
  GenerateCardsRequest,
  GenerateCardsResponse,
  ApiResponse,
  CardTheme
} from '@xhscard/shared/types/index.js'

const router = Router()

// 生成小红书卡片
router.post('/generate', async (req, res) => {
  try {
    const { topic, count = 5, apiKey } = req.body as GenerateCardsRequest

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: '请提供主题'
      } as ApiResponse)
    }

    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({
        success: false,
        error: '请提供 Gemini API Key'
      } as ApiResponse)
    }

    // 初始化 Gemini
    initializeGemini(apiKey)

    // 生成卡片内容
    const cardContents = await generateCards(topic, Math.min(count, 7))

    // 转换为完整的 Card 对象
    const themes: CardTheme[] = ['pink', 'blue', 'orange', 'green', 'purple', 'sunset']
    const cards = cardContents.map((content, index) => ({
      id: `card-${Date.now()}-${index}`,
      title: content.title,
      content: content.content,
      tags: content.tags,
      theme: themes[index % themes.length],
      order: index + 1,
    }))

    res.json({
      success: true,
      data: { cards }
    } as ApiResponse<GenerateCardsResponse>)
  } catch (error) {
    console.error('生成卡片失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成卡片失败'
    } as ApiResponse)
  }
})

export default router
