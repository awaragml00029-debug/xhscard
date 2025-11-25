// ==================== 通用类型 ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ==================== 卡片相关类型 ====================

export type CardTheme =
  | 'pink'      // 粉色少女系
  | 'blue'      // 清新蓝调
  | 'orange'    // 活力橙黄
  | 'green'     // 自然绿意
  | 'purple'    // 优雅紫调
  | 'sunset'    // 日落暖调

export interface Card {
  id: string
  title: string
  content: string
  tags: string[]
  theme: CardTheme
  order: number
}

export interface CardColorScheme {
  name: string
  gradient: string
  titleColor: string
  contentColor: string
  tagBg: string
  tagText: string
}

// ==================== PPT 相关类型 ====================

export type PPTSlideType = 'cover' | 'content' | 'ending'

export type PPTTheme =
  | 'business-blue'   // 商务蓝
  | 'tech-purple'     // 科技紫
  | 'fresh-green'     // 清新绿
  | 'warm-orange'     // 温暖橙
  | 'elegant-gray'    // 优雅灰
  | 'vibrant-red'     // 活力红

export interface PPTSlide {
  id: string
  type: PPTSlideType
  title: string
  content: string[]      // 内容要点（数组）
  notes?: string         // 演讲备注
  theme: PPTTheme
  order: number
}

export interface PPTThemeConfig {
  name: string
  primary: string        // 主色
  secondary: string      // 辅色
  background: string     // 背景色
  textColor: string      // 文字颜色
  accentColor: string    // 强调色
}

// ==================== Gemini 响应类型 ====================

export interface GeminiCardContent {
  title: string
  content: string
  tags: string[]
}

export interface GeminiPPTContent {
  type: PPTSlideType
  title: string
  content: string[]
  notes?: string
}

// ==================== API 请求/响应类型 ====================

// 配置 API
export interface ConfigRequest {
  apiKey: string
}

// 卡片生成 API
export interface GenerateCardsRequest {
  topic: string
  count?: number        // 卡片数量（3-7）
  apiKey: string
}

export interface GenerateCardsResponse {
  cards: Card[]
}

// PPT 生成 API
export interface GeneratePPTRequest {
  topic: string
  slideCount?: number   // 幻灯片数量（5-15）
  theme?: PPTTheme
  language?: string     // 语言（zh/en）
  apiKey: string
}

export interface GeneratePPTResponse {
  slides: PPTSlide[]
}

// PPT 导出 API
export interface ExportPPTRequest {
  slides: PPTSlide[]
  theme: PPTTheme
  title: string
}

export interface ExportPPTResponse {
  downloadUrl: string
  filename: string
}

// PPT 主题列表 API
export interface GetPPTThemesResponse {
  themes: PPTThemeConfig[]
}
