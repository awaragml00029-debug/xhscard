/**
 * 三步式卡片生成流程 API
 * Step 1: 生成大纲
 * Step 2: 用户确认/编辑
 * Step 3: 生成图片
 */

import { Router } from 'express'
import { initializeGemini, generateOutline } from '../services/gemini.service.js'
import {
  createOutline,
  getOutline,
  updateOutline
} from '../services/outline.service.js'
import {
  generateCardImages,
  validateImageConfig,
  type ImageGenerationConfig
} from '../services/image-generation.service.js'
import { validateCardCount, getConfig } from '../utils/config.js'
import type {
  CreateOutlineRequest,
  CreateOutlineResponse,
  UpdateOutlineRequest,
  UpdateOutlineResponse,
  GetOutlineResponse,
  GenerateImagesRequest,
  GenerateImagesResponse,
  ApiResponse
} from '@xhscard/shared/types/index.js'

const router = Router()

// Step 1: 生成文案大纲
router.post('/outline', async (req, res) => {
  try {
    const config = getConfig()
    const {
      topic,
      count = config.content.cards.defaultCount,
      apiKey
    } = req.body as CreateOutlineRequest

    // 验证参数
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

    // 验证并限制卡片数量
    const validatedCount = validateCardCount(count)

    // 初始化 Gemini
    initializeGemini(apiKey)

    // 生成大纲
    const cards = await generateOutline(topic, validatedCount)

    // 保存到存储
    const outline = createOutline(topic, cards)

    res.json({
      success: true,
      data: {
        outlineId: outline.id,
        topic: outline.topic,
        cards: outline.cards,
        status: outline.status
      }
    } as ApiResponse<CreateOutlineResponse>)
  } catch (error) {
    console.error('生成大纲失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成大纲失败'
    } as ApiResponse)
  }
})

// Step 2: 更新大纲（用户确认/编辑）
router.put('/outline/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { cards } = req.body as UpdateOutlineRequest

    // 验证参数
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        error: '请提供卡片数据'
      } as ApiResponse)
    }

    // 获取现有大纲
    const existingOutline = getOutline(id)
    if (!existingOutline) {
      return res.status(404).json({
        success: false,
        error: '大纲不存在或已过期'
      } as ApiResponse)
    }

    // 更新大纲
    const updatedOutline = updateOutline(id, {
      cards,
      status: 'confirmed'
    })

    if (!updatedOutline) {
      return res.status(500).json({
        success: false,
        error: '更新大纲失败'
      } as ApiResponse)
    }

    res.json({
      success: true,
      data: {
        outlineId: updatedOutline.id,
        status: updatedOutline.status,
        updatedAt: updatedOutline.updatedAt
      }
    } as ApiResponse<UpdateOutlineResponse>)
  } catch (error) {
    console.error('更新大纲失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新大纲失败'
    } as ApiResponse)
  }
})

// 获取大纲
router.get('/outline/:id', async (req, res) => {
  try {
    const { id } = req.params

    const outline = getOutline(id)
    if (!outline) {
      return res.status(404).json({
        success: false,
        error: '大纲不存在或已过期'
      } as ApiResponse)
    }

    res.json({
      success: true,
      data: {
        outline
      }
    } as ApiResponse<GetOutlineResponse>)
  } catch (error) {
    console.error('获取大纲失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取大纲失败'
    } as ApiResponse)
  }
})

// Step 3: 生成图片
router.post('/generate-images', async (req, res) => {
  try {
    const {
      outlineId,
      theme = 'pink',
      style = 'xiaohongshu',
      apiKey
    } = req.body as GenerateImagesRequest

    // 验证参数
    if (!outlineId) {
      return res.status(400).json({
        success: false,
        error: '请提供大纲 ID'
      } as ApiResponse)
    }

    // 获取大纲
    const outline = getOutline(outlineId)
    if (!outline) {
      return res.status(404).json({
        success: false,
        error: '大纲不存在或已过期'
      } as ApiResponse)
    }

    if (outline.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: '请先确认大纲后再生成图片'
      } as ApiResponse)
    }

    // 更新状态为正在生成
    updateOutline(outlineId, { status: 'generating' })

    // 配置图片生成服务
    // 优先级：Gemini API Key > OpenAI API Key > 占位符
    let provider: ImageGenerationConfig['provider'] = 'placeholder'

    if (apiKey) {
      if (apiKey.startsWith('sk-')) {
        // OpenAI API Key - 使用 DALL-E 3
        provider = 'dalle3'
      } else if (apiKey.startsWith('AI') || apiKey.length > 30) {
        // Gemini API Key（通常以 AI 开头或较长）- 使用 Gemini（推荐）
        provider = 'gemini'
      }
    }

    const imageConfig: ImageGenerationConfig = {
      provider,
      apiKey: apiKey
    }

    // 验证配置
    const configValidation = validateImageConfig(imageConfig)
    if (!configValidation.valid) {
      updateOutline(outlineId, { status: 'failed' })
      return res.status(400).json({
        success: false,
        error: configValidation.error
      } as ApiResponse)
    }

    // 生成图片
    console.log(`🎨 开始为大纲 ${outlineId} 生成 ${outline.cards.length} 张图片...`)
    console.log(`📍 使用提供商: ${imageConfig.provider}`)

    const cardsWithImages = await generateCardImages(
      outline.cards,
      theme,
      style,
      imageConfig,
      3 // 并发数：一次生成 3 张
    )

    // 检查是否有失败的卡片
    const failedCards = cardsWithImages.filter(card => card.status === 'failed')
    const status = failedCards.length === cardsWithImages.length ? 'failed' : 'completed'

    // 更新大纲
    const updatedOutline = updateOutline(outlineId, {
      cards: cardsWithImages,
      status
    })

    if (!updatedOutline) {
      return res.status(500).json({
        success: false,
        error: '更新大纲失败'
      } as ApiResponse)
    }

    console.log(`✅ 图片生成完成: ${cardsWithImages.length - failedCards.length}/${cardsWithImages.length} 张成功`)

    res.json({
      success: true,
      data: {
        cards: updatedOutline.cards,
        status: updatedOutline.status
      },
      message: failedCards.length > 0
        ? `部分图片生成失败 (${failedCards.length}/${cardsWithImages.length})`
        : undefined
    } as ApiResponse<GenerateImagesResponse>)
  } catch (error) {
    console.error('生成图片失败:', error)

    // 更新状态为失败
    if (req.body.outlineId) {
      updateOutline(req.body.outlineId, { status: 'failed' })
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成图片失败'
    } as ApiResponse)
  }
})

export default router
