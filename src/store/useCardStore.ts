import { create } from 'zustand'
import type { Card, AppState } from '@/types'

interface CardStore extends AppState {
  // Actions
  setTopic: (topic: string) => void
  setCards: (cards: Card[]) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  deleteCard: (id: string) => void
  setEditingCardId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setApiKey: (apiKey: string) => void
  reset: () => void
}

const initialState: AppState = {
  topic: '',
  cards: [],
  editingCardId: null,
  isLoading: false,
  error: null,
  apiKey: localStorage.getItem('gemini_api_key') || '',
}

export const useCardStore = create<CardStore>((set) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),

  setCards: (cards) => set({ cards }),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    })),

  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  setEditingCardId: (id) => set({ editingCardId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setApiKey: (apiKey) => {
    localStorage.setItem('gemini_api_key', apiKey)
    set({ apiKey })
  },

  reset: () => set(initialState),
}))
