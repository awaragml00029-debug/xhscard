import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import type { Card } from '@/types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'

interface CardEditorProps {
  card: Card
  onSave: (id: string, updates: Partial<Card>) => void
  onClose: () => void
}

export function CardEditor({ card, onSave, onClose }: CardEditorProps) {
  const [title, setTitle] = useState(card.title)
  const [content, setContent] = useState(card.content)
  const [tags, setTags] = useState(card.tags.join(', '))

  const handleSave = () => {
    onSave(card.id, {
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">编辑卡片</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 表单 */}
          <div className="space-y-4">
            <Input
              label="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入卡片标题"
            />

            <Textarea
              label="内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入卡片内容&#10;支持使用 emoji 和换行"
              rows={8}
            />

            <Input
              label="标签（用逗号分隔）"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="标签1, 标签2, 标签3"
            />
          </div>

          {/* 底部按钮 */}
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              取消
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
