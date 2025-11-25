import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, ArrowLeft } from 'lucide-react'
import { useCardStore } from '@/store/useCardStore'
import { CardPreview } from './CardPreview'
import { CardEditor } from './CardEditor'
import { Button } from './ui/Button'
import { exportCardToPNG, exportAllCards } from '@/lib/exportUtils'
import { getNextTheme } from '@/lib/cardThemes'
import type { Card } from '@/types'

export function CardList() {
  const { cards, updateCard, deleteCard, reset } = useCardStore()
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleEdit = (card: Card) => {
    setEditingCard(card)
  }

  const handleSave = (id: string, updates: Partial<Card>) => {
    updateCard(id, updates)
  }

  const handleChangeTheme = (id: string) => {
    const card = cards.find((c) => c.id === id)
    if (card) {
      updateCard(id, { theme: getNextTheme(card.theme) })
    }
  }

  const handleExportSingle = async (id: string) => {
    const element = document.getElementById(`card-${id}`)
    if (element) {
      const card = cards.find((c) => c.id === id)
      const filename = card ? `${card.title}.png` : `card-${id}.png`
      await exportCardToPNG(element, filename)
    }
  }

  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      const elements = cards.map((card) =>
        document.getElementById(`card-${card.id}`)
      ).filter((el): el is HTMLElement => el !== null)

      await exportAllCards(elements, '小红书卡片')
    } catch (error) {
      console.error('批量导出失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (cards.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* 顶部操作栏 */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={reset}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新生成
          </Button>
          <Button onClick={handleExportAll} disabled={isExporting}>
            {isExporting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                导出中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                导出全部
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardPreview
                card={card}
                totalCards={cards.length}
                onEdit={handleEdit}
                onDelete={deleteCard}
                onChangeTheme={handleChangeTheme}
                onExport={handleExportSingle}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 编辑器弹窗 */}
      {editingCard && (
        <CardEditor
          card={editingCard}
          onSave={handleSave}
          onClose={() => setEditingCard(null)}
        />
      )}
    </motion.div>
  )
}
