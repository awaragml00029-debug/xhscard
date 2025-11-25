import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Key } from 'lucide-react'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'
import { Input } from './ui/Input'
import { useCardStore } from '@/store/useCardStore'
import { initializeGemini, generateCards } from '@/lib/gemini'
import { getRandomTheme } from '@/lib/cardThemes'

export function ThemeInput() {
  const [topic, setTopic] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')

  const { apiKey, setApiKey, setCards, setLoading, setError, isLoading } = useCardStore()

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题')
      return
    }

    if (!apiKey) {
      setShowApiKeyInput(true)
      setError('请先设置 Gemini API Key')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // 初始化 Gemini
      initializeGemini(apiKey)

      // 生成卡片内容
      const cardContents = await generateCards(topic)

      // 转换为 Card 对象
      const cards = cardContents.map((content, index) => ({
        id: `card-${Date.now()}-${index}`,
        title: content.title,
        content: content.content,
        tags: content.tags,
        theme: getRandomTheme(),
        order: index + 1,
      }))

      setCards(cards)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('生成失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim())
      setShowApiKeyInput(false)
      setError(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
          小红书文案助手
        </h1>
        <p className="text-gray-600">输入主题，AI 自动生成精美内容卡片</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {/* API Key 设置 */}
        {!apiKey || showApiKeyInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-2">设置 Gemini API Key</h3>
                <Input
                  type="password"
                  placeholder="粘贴你的 Gemini API Key"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveApiKey}>
                    保存
                  </Button>
                  {apiKey && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowApiKeyInput(false)}
                    >
                      取消
                    </Button>
                  )}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  获取 API Key: <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">https://ai.google.dev/</a>
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">API Key 已设置</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowApiKeyInput(true)
                setTempApiKey(apiKey)
              }}
            >
              更改
            </Button>
          </div>
        )}

        {/* 主题输入 */}
        <Textarea
          label="输入你的主题"
          placeholder="例如：夏日穿搭指南、健康早餐食谱、高效学习方法..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
          disabled={isLoading}
        />

        {/* 生成按钮 */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              生成内容卡片
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
