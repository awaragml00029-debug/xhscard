import type { ColorScheme, ThemeColor } from '@/types'

// 6种精美的小红书风格配色方案
export const colorSchemes: Record<ThemeColor, ColorScheme> = {
  pink: {
    name: '粉色少女',
    gradient: 'linear-gradient(135deg, #ffeef8 0%, #ffc3e1 100%)',
    titleColor: '#ff1493',
    contentColor: '#8b4789',
    tagBg: '#ffe4f3',
    tagText: '#ff1493',
  },
  blue: {
    name: '清新蓝调',
    gradient: 'linear-gradient(135deg, #e0f7ff 0%, #a8d8ff 100%)',
    titleColor: '#0066cc',
    contentColor: '#004d99',
    tagBg: '#d4edff',
    tagText: '#0066cc',
  },
  orange: {
    name: '活力橙黄',
    gradient: 'linear-gradient(135deg, #fff4e6 0%, #ffd699 100%)',
    titleColor: '#ff6600',
    contentColor: '#cc5200',
    tagBg: '#ffe6cc',
    tagText: '#ff6600',
  },
  green: {
    name: '自然绿意',
    gradient: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
    titleColor: '#2e7d32',
    contentColor: '#1b5e20',
    tagBg: '#c8e6c9',
    tagText: '#2e7d32',
  },
  purple: {
    name: '优雅紫调',
    gradient: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
    titleColor: '#7b1fa2',
    contentColor: '#4a148c',
    tagBg: '#e1bee7',
    tagText: '#7b1fa2',
  },
  sunset: {
    name: '日落暖调',
    gradient: 'linear-gradient(135deg, #ffece6 0%, #ffb399 100%)',
    titleColor: '#ff5722',
    contentColor: '#d84315',
    tagBg: '#ffccbc',
    tagText: '#ff5722',
  },
}

// 随机获取一个主题颜色
export function getRandomTheme(): ThemeColor {
  const themes: ThemeColor[] = ['pink', 'blue', 'orange', 'green', 'purple', 'sunset']
  return themes[Math.floor(Math.random() * themes.length)]
}

// 获取下一个主题（用于卡片循环使用不同主题）
export function getNextTheme(currentTheme: ThemeColor): ThemeColor {
  const themes: ThemeColor[] = ['pink', 'blue', 'orange', 'green', 'purple', 'sunset']
  const currentIndex = themes.indexOf(currentTheme)
  return themes[(currentIndex + 1) % themes.length]
}
