import { Router } from 'express'
import { initializeGemini, generatePPT } from '../services/gemini.service.js'
import { generatePPTFile, getAllThemes, PPT_THEMES } from '../services/ppt.service.js'
import { validateSlideCount, getConfig } from '../utils/config.js'
import type {
  GeneratePPTRequest,
  GeneratePPTResponse,
  ExportPPTRequest,
  ExportPPTResponse,
  GetPPTThemesResponse,
  ApiResponse,
  PPTTheme
} from '@xhscard/shared/types/index.js'

const router = Router()

// 生成 PPT 内容
router.post('/generate', async (req, res) => {
  try {
    const config = getConfig()
    const {
      topic,
      slideCount = config.content.ppt.defaultSlides,
      theme = 'business-blue',
      language = 'zh',
      apiKey
    } = req.body as GeneratePPTRequest

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

    // 验证并限制幻灯片数量
    const validatedCount = validateSlideCount(slideCount)

    // 初始化 Gemini
    initializeGemini(apiKey)

    // 生成 PPT 内容
    const pptContents = await generatePPT(
      topic,
      validatedCount,
      language
    )

    // 转换为完整的 PPTSlide 对象
    const slides = pptContents.map((content, index) => ({
      id: `slide-${Date.now()}-${index}`,
      type: content.type,
      title: content.title,
      content: content.content,
      notes: content.notes,
      theme: theme as PPTTheme,
      order: index + 1,
    }))

    res.json({
      success: true,
      data: { slides }
    } as ApiResponse<GeneratePPTResponse>)
  } catch (error) {
    console.error('生成 PPT 失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成 PPT 失败'
    } as ApiResponse)
  }
})

// 导出 PPT 文件
router.post('/export', async (req, res) => {
  try {
    const { slides, theme, title } = req.body as ExportPPTRequest

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        error: '请提供幻灯片内容'
      } as ApiResponse)
    }

    if (!theme || !PPT_THEMES[theme as PPTTheme]) {
      return res.status(400).json({
        success: false,
        error: '无效的主题'
      } as ApiResponse)
    }

    // 生成 PPT 文件
    const buffer = await generatePPTFile(slides, theme as PPTTheme, title)

    // 设置响应头
    const filename = `${title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_${Date.now()}.pptx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    res.setHeader('Content-Length', buffer.length)

    // 发送文件
    res.send(buffer)
  } catch (error) {
    console.error('导出 PPT 失败:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '导出 PPT 失败'
    } as ApiResponse)
  }
})

// 获取所有主题
router.get('/themes', (_req, res) => {
  try {
    const themes = getAllThemes()
    res.json({
      success: true,
      data: { themes }
    } as ApiResponse<GetPPTThemesResponse>)
  } catch (error) {
    console.error('获取主题失败:', error)
    res.status(500).json({
      success: false,
      error: '获取主题失败'
    } as ApiResponse)
  }
})

export default router
