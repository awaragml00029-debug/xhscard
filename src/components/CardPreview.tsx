import { motion } from 'framer-motion'
import { Edit2, Download, Trash2, Palette } from 'lucide-react'
import type { Card as CardType } from '@/types'
import { colorSchemes } from '@/lib/cardThemes'
import { Button } from './ui/Button'

interface CardPreviewProps {
  card: CardType
  totalCards: number
  onEdit: (card: CardType) => void
  onDelete: (id: string) => void
  onChangeTheme: (id: string) => void
  onExport: (id: string) => void
}

export function CardPreview({
  card,
  totalCards,
  onEdit,
  onDelete,
  onChangeTheme,
  onExport,
}: CardPreviewProps) {
  const theme = colorSchemes[card.theme]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col"
    >
      {/* 卡片预览 */}
      <div
        id={`card-${card.id}`}
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: '360px',
          height: '480px',
          background: theme.gradient,
        }}
      >
        {/* 装饰性背景图案 */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${card.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${card.id})`} />
          </svg>
        </div>

        {/* 内容区域 */}
        <div className="relative h-full flex flex-col p-8">
          {/* 页码 */}
          <div className="absolute top-6 right-6">
            <div
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: theme.tagBg,
                color: theme.tagText,
              }}
            >
              {card.order}/{totalCards}
            </div>
          </div>

          {/* 标题 */}
          <div className="flex-shrink-0 mb-6 mt-8">
            <h2
              className="text-3xl font-bold leading-tight"
              style={{ color: theme.titleColor }}
            >
              {card.title}
            </h2>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-auto">
            <div
              className="text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: theme.contentColor }}
            >
              {card.content}
            </div>
          </div>

          {/* 标签 */}
          {card.tags.length > 0 && (
            <div className="flex-shrink-0 mt-6">
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: theme.tagBg,
                      color: theme.tagText,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(card)}
          className="flex-1"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          编辑
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChangeTheme(card.id)}
          className="flex-1"
        >
          <Palette className="w-4 h-4 mr-1" />
          换色
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onExport(card.id)}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-1" />
          导出
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(card.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
