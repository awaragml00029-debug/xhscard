import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useCardStore } from '@/store/useCardStore'

export function ErrorMessage() {
  const { error, setError } = useCardStore()

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 mb-1">出错了</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
