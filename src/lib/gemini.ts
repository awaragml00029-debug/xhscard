import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GeminiCardContent } from '@/types'

let genAI: GoogleGenerativeAI | null = null

export function initializeGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey)
}

export async function generateCards(topic: string): Promise<GeminiCardContent[]> {
  if (!genAI) {
    throw new Error('Gemini API 未初始化，请先设置 API Key')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `你是一个专业的小红书内容创作助手。请根据以下主题，生成3-7张小红书风格的内容卡片。

主题：${topic}

要求：
1. 将主题拆分成3-7个小主题，每个主题一张卡片
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

    // 尝试提取 JSON
    let jsonText = text.trim()

    // 如果响应包含代码块，提取其中的 JSON
    const codeBlockMatch = text.match(/```json?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    // 解析 JSON
    const cards = JSON.parse(jsonText) as GeminiCardContent[]

    // 验证和清理数据
    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('生成的内容格式不正确')
    }

    // 限制在7张以内
    return cards.slice(0, 7).map((card) => ({
      title: card.title || '无标题',
      content: card.content || '',
      tags: Array.isArray(card.tags) ? card.tags.slice(0, 5) : [],
    }))
  } catch (error) {
    console.error('Gemini API 错误:', error)
    if (error instanceof Error) {
      throw new Error(`生成内容失败: ${error.message}`)
    }
    throw new Error('生成内容失败，请检查 API Key 或网络连接')
  }
}
