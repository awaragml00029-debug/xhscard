/**
 * 配置管理工具
 * 借鉴 RedInk 的可插拔配置设计
 */

export interface ServerConfig {
  port: number
  cors: {
    enabled: boolean
    origins: string[]
  }
}

export interface AIProviderConfig {
  enabled: boolean
  model: string
  baseUrl?: string
}

export interface ContentConfig {
  cards: {
    minCount: number
    maxCount: number
    defaultCount: number
    themes: string[]
  }
  ppt: {
    minSlides: number
    maxSlides: number
    defaultSlides: number
    themes: string[]
    concurrency: {
      enabled: boolean
      maxWorkers: number
    }
  }
}

export interface Config {
  server: ServerConfig
  aiProviders: {
    gemini: AIProviderConfig
    openai?: AIProviderConfig
    custom?: AIProviderConfig
  }
  content: ContentConfig
  export: {
    png: {
      resolution: number
      quality: number
    }
    pptx: {
      author: string
      company: string
    }
  }
  rateLimit: {
    enabled: boolean
    windowMs: number
    maxRequests: number
  }
}

// 默认配置（如果没有 config.yaml）
export const defaultConfig: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000'),
    cors: {
      enabled: true,
      origins: ['http://localhost:5173', 'http://localhost:3000']
    }
  },
  aiProviders: {
    gemini: {
      enabled: true,
      model: 'gemini-pro'
    }
  },
  content: {
    cards: {
      minCount: 3,
      maxCount: 7,
      defaultCount: 5,
      themes: ['pink', 'blue', 'orange', 'green', 'purple', 'sunset']
    },
    ppt: {
      minSlides: 5,
      maxSlides: 15,
      defaultSlides: 8,
      themes: ['business-blue', 'tech-purple', 'fresh-green', 'warm-orange', 'elegant-gray', 'vibrant-red'],
      concurrency: {
        enabled: false,
        maxWorkers: 5
      }
    }
  },
  export: {
    png: {
      resolution: 2,
      quality: 0.95
    },
    pptx: {
      author: 'XHS Card Generator',
      company: ''
    }
  },
  rateLimit: {
    enabled: false,
    windowMs: 900000,
    maxRequests: 100
  }
}

/**
 * 获取配置
 * 优先级：环境变量 > config.yaml > 默认配置
 */
export function getConfig(): Config {
  // 目前使用默认配置
  // 未来可以添加 YAML 文件加载逻辑
  return defaultConfig
}

/**
 * 验证卡片数量
 */
export function validateCardCount(count: number): number {
  const config = getConfig()
  return Math.max(
    config.content.cards.minCount,
    Math.min(count, config.content.cards.maxCount)
  )
}

/**
 * 验证 PPT 幻灯片数量
 */
export function validateSlideCount(count: number): number {
  const config = getConfig()
  return Math.max(
    config.content.ppt.minSlides,
    Math.min(count, config.content.ppt.maxSlides)
  )
}
