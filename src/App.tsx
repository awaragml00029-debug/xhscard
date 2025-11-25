import { useCardStore } from './store/useCardStore'
import { ThemeInput } from './components/ThemeInput'
import { CardList } from './components/CardList'
import { ErrorMessage } from './components/ErrorMessage'

function App() {
  const { cards } = useCardStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {cards.length === 0 ? (
          <ThemeInput />
        ) : (
          <CardList />
        )}
      </div>

      <ErrorMessage />

      {/* 页脚 */}
      <footer className="text-center py-8 text-sm text-gray-500">
        <p>小红书文案助手 • 由 Gemini Pro 驱动</p>
      </footer>
    </div>
  )
}

export default App
