import PptxGenJS from 'pptxgenjs'
import type { PPTSlide, PPTTheme, PPTThemeConfig } from '@xhscard/shared/types/index.js'

// PPT 主题配置
export const PPT_THEMES: Record<PPTTheme, PPTThemeConfig> = {
  'business-blue': {
    name: '商务蓝',
    primary: '0B5394',
    secondary: '3C78D8',
    background: 'FFFFFF',
    textColor: '1C1C1C',
    accentColor: '0B5394',
  },
  'tech-purple': {
    name: '科技紫',
    primary: '6A1B9A',
    secondary: '9C27B0',
    background: 'F3E5F5',
    textColor: '1A1A1A',
    accentColor: 'AB47BC',
  },
  'fresh-green': {
    name: '清新绿',
    primary: '2E7D32',
    secondary: '66BB6A',
    background: 'E8F5E9',
    textColor: '1B5E20',
    accentColor: '4CAF50',
  },
  'warm-orange': {
    name: '温暖橙',
    primary: 'E65100',
    secondary: 'FF9800',
    background: 'FFF3E0',
    textColor: '3E2723',
    accentColor: 'FB8C00',
  },
  'elegant-gray': {
    name: '优雅灰',
    primary: '424242',
    secondary: '757575',
    background: 'FAFAFA',
    textColor: '212121',
    accentColor: '616161',
  },
  'vibrant-red': {
    name: '活力红',
    primary: 'C62828',
    secondary: 'E53935',
    background: 'FFEBEE',
    textColor: '1A1A1A',
    accentColor: 'D32F2F',
  },
}

/**
 * 生成 PPT 文件
 */
export async function generatePPTFile(
  slides: PPTSlide[],
  theme: PPTTheme,
  title: string
): Promise<Buffer> {
  const pptx = new PptxGenJS()
  const themeConfig = PPT_THEMES[theme]

  // 设置 PPT 属性
  pptx.author = 'XHS Card Generator'
  pptx.title = title
  pptx.subject = 'AI Generated Presentation'

  // 为每个幻灯片生成页面
  for (const slideData of slides) {
    const slide = pptx.addSlide()

    // 设置背景
    slide.background = { color: themeConfig.background }

    if (slideData.type === 'cover') {
      // 封面页
      createCoverSlide(slide, slideData, themeConfig)
    } else if (slideData.type === 'ending') {
      // 结束页
      createEndingSlide(slide, slideData, themeConfig)
    } else {
      // 内容页
      createContentSlide(slide, slideData, themeConfig)
    }

    // 添加页码（除了封面）
    if (slideData.type !== 'cover') {
      slide.addText(`${slideData.order}`, {
        x: 9.0,
        y: 7.0,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: themeConfig.secondary,
        align: 'right',
      })
    }
  }

  // 生成 PPT 文件
  const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
  return buffer
}

/**
 * 创建封面页
 */
function createCoverSlide(
  slide: any,
  data: PPTSlide,
  theme: PPTThemeConfig
) {
  // 顶部装饰条
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.3,
    fill: { color: theme.primary },
  })

  // 主标题
  slide.addText(data.title, {
    x: 1.0,
    y: 2.5,
    w: 8.0,
    h: 1.5,
    fontSize: 48,
    bold: true,
    color: theme.primary,
    align: 'center',
    valign: 'middle',
  })

  // 副标题/简介
  if (data.content.length > 0) {
    slide.addText(data.content[0], {
      x: 1.5,
      y: 4.2,
      w: 7.0,
      h: 0.8,
      fontSize: 20,
      color: theme.textColor,
      align: 'center',
      valign: 'middle',
    })
  }

  // 底部装饰
  slide.addShape('rect', {
    x: 0,
    y: 7.2,
    w: '100%',
    h: 0.3,
    fill: { color: theme.secondary },
  })
}

/**
 * 创建内容页
 */
function createContentSlide(
  slide: any,
  data: PPTSlide,
  theme: PPTThemeConfig
) {
  // 标题栏背景
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 1.0,
    fill: { color: theme.primary },
  })

  // 标题
  slide.addText(data.title, {
    x: 0.5,
    y: 0.2,
    w: 9.0,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: 'FFFFFF',
    valign: 'middle',
  })

  // 内容要点
  const contentY = 1.8
  const lineHeight = 0.8

  data.content.forEach((point, index) => {
    // 要点序号
    slide.addText(`${index + 1}`, {
      x: 0.8,
      y: contentY + index * lineHeight,
      w: 0.4,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: theme.accentColor,
      align: 'center',
      valign: 'middle',
    })

    // 要点内容
    slide.addText(point, {
      x: 1.5,
      y: contentY + index * lineHeight,
      w: 7.5,
      h: 0.6,
      fontSize: 18,
      color: theme.textColor,
      valign: 'middle',
    })
  })

  // 装饰线
  slide.addShape('line', {
    x: 0.5,
    y: 1.4,
    w: 9.0,
    h: 0,
    line: { color: theme.secondary, width: 2 },
  })
}

/**
 * 创建结束页
 */
function createEndingSlide(
  slide: any,
  data: PPTSlide,
  theme: PPTThemeConfig
) {
  // 背景渐变效果（使用矩形模拟）
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: theme.background },
  })

  // 标题
  slide.addText(data.title, {
    x: 1.0,
    y: 3.0,
    w: 8.0,
    h: 1.2,
    fontSize: 44,
    bold: true,
    color: theme.primary,
    align: 'center',
    valign: 'middle',
  })

  // 结束语
  if (data.content.length > 0) {
    slide.addText(data.content.join('\n'), {
      x: 1.5,
      y: 4.5,
      w: 7.0,
      h: 1.0,
      fontSize: 18,
      color: theme.textColor,
      align: 'center',
      valign: 'middle',
    })
  }

  // 装饰圆形
  slide.addShape('ellipse', {
    x: 4.25,
    y: 6.0,
    w: 1.5,
    h: 1.5,
    fill: { color: theme.accentColor, transparency: 70 },
  })
}

/**
 * 获取所有主题配置
 */
export function getAllThemes(): PPTThemeConfig[] {
  return Object.values(PPT_THEMES)
}
