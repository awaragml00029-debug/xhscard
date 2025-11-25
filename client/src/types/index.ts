// 卡片主题配色方案
export type ThemeColor =
  | 'pink'      // 粉色少女系
  | 'blue'      // 清新蓝调
  | 'orange'    // 活力橙黄
  | 'green'     // 自然绿意
  | 'purple'    // 优雅紫调
  | 'sunset'    // 日落暖调

// 卡片数据结构
export interface Card {
  id: string
  title: string
  content: string
  tags: string[]
  theme: ThemeColor
  order: number
}

// 卡片配色方案
export interface ColorScheme {
  name: string
  gradient: string
  titleColor: string
  contentColor: string
  tagBg: string
  tagText: string
}

// Gemini 响应结构
export interface GeminiCardContent {
  title: string
  content: string
  tags: string[]
}

// 应用状态
export interface AppState {
  // 用户输入的主题
  topic: string
  // 生成的卡片列表
  cards: Card[]
  // 当前正在编辑的卡片ID
  editingCardId: string | null
  // 加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
  // API Key
  apiKey: string
}
