/**
 * 图片生成服务
 *
 * 支持多种图片生成 API:
 * 1. Gemini Imagen (Google) - 推荐，性价比高
 * 2. DALL-E 3 (OpenAI) - 高质量
 * 3. Stable Diffusion - 开源选择
 * 4. 占位符 - 免费测试
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { OutlineCard } from '@xhscard/shared/types/index.js'

/**
 * 图片生成配置
 */
export interface ImageGenerationConfig {
  provider: 'gemini' | 'dalle3' | 'stable-diffusion' | 'placeholder'
  apiKey?: string
  baseUrl?: string
}

/**
 * 生成小红书风格的图片提示词
 */
function createImagePrompt(
  card: OutlineCard,
  theme: string,
  style: string
): string {
  return `Create a Xiaohongshu (Little Red Book) style content card image:

Title: ${card.title}
Description: ${card.description}
Key Points:
${card.points.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Design Requirements:
- Portrait orientation, 3:4 aspect ratio (1080x1440px recommended)
- Theme color: ${theme}
- Style: ${style} - clean, fresh, modern Chinese social media aesthetic
- Include emojis naturally in the design
- Clear, readable typography with Chinese characters
- Visually appealing with good use of whitespace
- Bright, vibrant colors that attract attention
- Professional yet friendly design

The image should look like a typical high-quality Xiaohongshu post that would get many likes and shares.`
}

/**
 * 使用 Gemini 生成图片
 *
 * 支持模型：
 * - gemini-2.0-flash-exp (推荐，最新)
 * - gemini-2.5-flash (稳定版)
 * - gemini-3-pro-image (高保真，4K)
 */
async function generateWithGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)

  // 使用 Gemini 2.0 Flash 模型生成图片（代号 "Nano Banana"）
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp'
  } as any)

  try {
    // 优化提示词：确保明确要求生成图片
    const imagePrompt = `Generate an image: ${prompt}`

    const result = await model.generateContent(imagePrompt)
    const response = result.response

    // 获取生成的图片
    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          // 检查 inlineData 中的图片数据
          if ((part as any).inlineData) {
            const inlineData = (part as any).inlineData
            if (inlineData.data) {
              const imageData = inlineData.data
              const mimeType = inlineData.mimeType || 'image/png'
              // 返回 base64 data URL
              return `data:${mimeType};base64,${imageData}`
            }
          }
        }
      }
    }

    throw new Error('未能从 Gemini 响应中获取图片数据')
  } catch (error) {
    console.error('Gemini 图片生成 API 错误:', error)
    throw new Error(`Gemini 图片生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 使用 DALL-E 3 生成图片
 */
async function generateWithDALLE3(
  prompt: string,
  apiKey: string,
  baseUrl: string = 'https://api.openai.com/v1'
): Promise<string> {
  const response = await fetch(`${baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1792',  // 接近 3:4 比例
      quality: 'hd',
      style: 'vivid'
    })
  })

  if (!response.ok) {
    const error = await response.json() as { error?: { message?: string } }
    throw new Error(`DALL-E 3 API 错误: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json() as { data: Array<{ url: string }> }
  return data.data[0].url
}

/**
 * 生成占位符图片（开发/测试用）
 */
function generatePlaceholder(
  card: OutlineCard,
  theme: string
): string {
  // 使用 placeholder 服务生成带文字的占位图
  const text = encodeURIComponent(card.title)
  const colors = {
    pink: 'FF69B4/FFB6C1',
    blue: '4A90E2/87CEEB',
    orange: 'FF8C42/FFB347',
    green: '4CAF50/81C784',
    purple: '9B59B6/C39BD3',
    sunset: 'FF6B6B/FFE66D'
  }
  const color = colors[theme as keyof typeof colors] || 'CCCCCC/EEEEEE'

  // 使用 placeholder.com 或类似服务
  return `https://via.placeholder.com/1080x1440/${color.replace('/', '/')}?text=${text}`
}

/**
 * 为单张卡片生成图片
 */
export async function generateCardImage(
  card: OutlineCard,
  theme: string = 'pink',
  style: string = 'xiaohongshu',
  config: ImageGenerationConfig
): Promise<string> {
  const prompt = createImagePrompt(card, theme, style)

  try {
    switch (config.provider) {
      case 'gemini':
        if (!config.apiKey) {
          throw new Error('Gemini Imagen 需要 API Key')
        }
        return await generateWithGemini(prompt, config.apiKey)

      case 'dalle3':
        if (!config.apiKey) {
          throw new Error('DALL-E 3 需要 API Key')
        }
        return await generateWithDALLE3(prompt, config.apiKey, config.baseUrl)

      case 'stable-diffusion':
        // TODO: 实现 Stable Diffusion 集成
        throw new Error('Stable Diffusion 集成即将上线')

      case 'placeholder':
      default:
        return generatePlaceholder(card, theme)
    }
  } catch (error) {
    console.error(`生成卡片图片失败 (${card.id}):`, error)
    throw error
  }
}

/**
 * 批量生成图片（带并发控制）
 */
export async function generateCardImages(
  cards: OutlineCard[],
  theme: string = 'pink',
  style: string = 'xiaohongshu',
  config: ImageGenerationConfig,
  concurrency: number = 3
): Promise<OutlineCard[]> {
  const results: OutlineCard[] = []

  // 分批处理，避免并发过高
  for (let i = 0; i < cards.length; i += concurrency) {
    const batch = cards.slice(i, i + concurrency)

    const batchResults = await Promise.allSettled(
      batch.map(async (card) => {
        const imageUrl = await generateCardImage(card, theme, style, config)
        return {
          ...card,
          imageUrl,
          status: 'completed' as const
        }
      })
    )

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        // 失败的卡片也要返回，但标记为失败
        const failedCard = batch[batchResults.indexOf(result)]
        results.push({
          ...failedCard,
          status: 'failed' as const
        })
        console.error(`卡片 ${failedCard.id} 图片生成失败:`, result.reason)
      }
    }

    // 添加延迟，避免 API 限流
    if (i + concurrency < cards.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

/**
 * 检查图片生成配置是否有效
 */
export function validateImageConfig(config: ImageGenerationConfig): { valid: boolean; error?: string } {
  if (config.provider === 'gemini' && !config.apiKey) {
    return { valid: false, error: 'Gemini Imagen 需要提供 Gemini API Key' }
  }

  if (config.provider === 'dalle3' && !config.apiKey) {
    return { valid: false, error: 'DALL-E 3 需要提供 OpenAI API Key' }
  }

  if (config.provider === 'stable-diffusion') {
    return { valid: false, error: 'Stable Diffusion 集成尚未实现' }
  }

  return { valid: true }
}

console.log('🎨 Image generation service initialized')
