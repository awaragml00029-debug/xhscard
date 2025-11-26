import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
  GeminiCardContent,
  GeminiPPTContent,
  OutlineCard
} from '@xhscard/shared/types/index.js'

let genAI: GoogleGenerativeAI | null = null

export function initializeGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey)
}

/**
 * 生成小红书卡片内容
 */
export async function generateCards(
  topic: string,
  count: number = 5
): Promise<GeminiCardContent[]> {
  if (!genAI) {
    throw new Error('Gemini API 未初始化')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `你是一个专业的小红书内容创作助手。请根据以下主题，生成${count}张小红书风格的内容卡片。

主题：${topic}

要求：
1. 将主题拆分成${count}个小主题，每个主题一张卡片
2. 每张卡片包含：
   - title: 简短有力的标题（10-20字），要吸引眼球
   - content: 正文内容（80-150字），要简洁有力，适当使用emoji，分点展示
   - tags: 3-5个相关标签

请以JSON数组格式返回，例如：
[
  {
    "title": "第一张卡片标题",
    "content": "📍 第一点内容\\n✨ 第二点内容\\n💡 第三点内容",
    "tags": ["标签1", "标签2", "标签3"]
  }
]

请直接返回JSON，不要其他说明文字。`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let jsonText = text.trim()
    const codeBlockMatch = text.match(/```json?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    const cards = JSON.parse(jsonText) as GeminiCardContent[]

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('生成的内容格式不正确')
    }

    return cards.slice(0, count).map((card) => ({
      title: card.title || '无标题',
      content: card.content || '',
      tags: Array.isArray(card.tags) ? card.tags.slice(0, 5) : [],
    }))
  } catch (error) {
    console.error('Gemini API 错误:', error)
    throw new Error(`生成卡片失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 生成小红书卡片大纲（三步式流程 Step 1）
 */
export async function generateOutline(
  topic: string,
  count: number = 5
): Promise<OutlineCard[]> {
  if (!genAI) {
    throw new Error('Gemini API 未初始化')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `你是一个专业的小红书内容创作助手。请根据以下主题，生成${count}张小红书风格的内容卡片大纲。

主题：${topic}

要求：
1. 将主题拆分成${count}个小主题，每个主题一张卡片
2. 每张卡片包含：
   - title: 简短有力的标题（10-20字），要吸引眼球
   - description: 卡片描述（20-40字），说明这张卡片的主要内容
   - points: 3-5个要点（每个要点10-20字），使用emoji开头

请以JSON数组格式返回，例如：
[
  {
    "title": "秋季穿搭第一课",
    "description": "温暖色调搭配技巧",
    "points": ["📍 选择大地色系", "✨ 叠穿是关键", "💡 配饰点缀"]
  }
]

请直接返回JSON，不要其他说明文字。`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let jsonText = text.trim()
    const codeBlockMatch = text.match(/```json?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    const outlines = JSON.parse(jsonText) as Array<{
      title: string
      description: string
      points: string[]
    }>

    if (!Array.isArray(outlines) || outlines.length === 0) {
      throw new Error('生成的内容格式不正确')
    }

    return outlines.slice(0, count).map((outline, index) => ({
      id: `card-${Date.now()}-${index}`,
      order: index + 1,
      title: outline.title || '无标题',
      description: outline.description || '',
      points: Array.isArray(outline.points) ? outline.points.slice(0, 5) : [],
    }))
  } catch (error) {
    console.error('Gemini API 错误:', error)
    throw new Error(`生成大纲失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 生成 PPT 幻灯片内容
 */
export async function generatePPT(
  topic: string,
  slideCount: number = 8,
  language: string = 'zh'
): Promise<GeminiPPTContent[]> {
  if (!genAI) {
    throw new Error('Gemini API 未初始化')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = language === 'zh' ? `你是一个专业的 PPT 内容创作助手。请根据以下主题，生成一个完整的 PPT 演示文稿大纲。

主题：${topic}

要求：
1. 生成${slideCount}张幻灯片，包括：
   - 第1张：封面（type: "cover"）
   - 第2-${slideCount - 1}张：内容页（type: "content"）
   - 第${slideCount}张：结束页（type: "ending"）

2. 每张幻灯片包含：
   - type: 幻灯片类型（cover/content/ending）
   - title: 幻灯片标题（简短有力，8-15字）
   - content: 内容要点数组（3-5个要点，每个要点15-30字）
   - notes: 演讲备注（可选，50-100字）

请以JSON数组格式返回，例如：
[
  {
    "type": "cover",
    "title": "${topic}",
    "content": ["副标题或简介"],
    "notes": "开场白建议"
  },
  {
    "type": "content",
    "title": "第一章节标题",
    "content": ["要点1：具体内容", "要点2：具体内容", "要点3：具体内容"],
    "notes": "讲解要点"
  }
]

请直接返回JSON，不要其他说明文字。` : `You are a professional PPT content creator. Generate a complete PPT presentation outline based on the topic.

Topic: ${topic}

Requirements:
1. Generate ${slideCount} slides including:
   - Slide 1: Cover (type: "cover")
   - Slides 2-${slideCount - 1}: Content (type: "content")
   - Slide ${slideCount}: Ending (type: "ending")

2. Each slide contains:
   - type: Slide type (cover/content/ending)
   - title: Slide title (concise, 5-10 words)
   - content: Key points array (3-5 points, each 10-20 words)
   - notes: Speaker notes (optional, 30-50 words)

Return JSON array format directly without explanation.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let jsonText = text.trim()
    const codeBlockMatch = text.match(/```json?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    const slides = JSON.parse(jsonText) as GeminiPPTContent[]

    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error('生成的内容格式不正确')
    }

    return slides.slice(0, slideCount).map((slide) => ({
      type: slide.type || 'content',
      title: slide.title || '无标题',
      content: Array.isArray(slide.content) ? slide.content : [],
      notes: slide.notes,
    }))
  } catch (error) {
    console.error('Gemini API 错误:', error)
    throw new Error(`生成 PPT 失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}
