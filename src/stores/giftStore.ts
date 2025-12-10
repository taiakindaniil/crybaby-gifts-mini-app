import { create } from 'zustand'
import type { Gift } from '@/types/gift'
import { useGiftDataStore } from './giftDataStore'

export const giftFields = [
    { label: 'Gifts', key: 'gifts' },
    { label: 'Model', key: 'model' },
    { label: 'Background', key: 'background' },
    { label: 'Pattern', key: 'pattern' },
]

export type GiftFieldKey = typeof giftFields[number]['key']

type GiftStore = {
    selectedGift: Gift | null

    editingFieldKey: string | null
    setEditingFieldKey: (key: string | null) => void

    setSelectedGift: (gift: Gift | null) => void
    selectField: (key: keyof GiftFieldKey, value: string) => void
}

export const useGiftStore = create<GiftStore>((set, get) => ({
    selectedGift: null,

    editingFieldKey: null,
    setEditingFieldKey: (key) => set(() => ({ editingFieldKey: key })),
  
    setSelectedGift: (gift) => set(() => ({ selectedGift: gift })),
  
    selectField: (key, value) => {
      const state = get()
      
      let updatedGift = state.selectedGift

      if (key.toString() === 'gifts') {
        if (state.selectedGift) {
            updatedGift = {
              ...state.selectedGift,
              name: value,
              model: undefined,
            }
        } else {
            updatedGift = {
                id: 0,
                name: value
            }
        }
      }

      // Если изменяем модель — обновляем selectedGift
      if (state.selectedGift && key.toString() === 'model') {
        updatedGift = {
          ...state.selectedGift,
          model: value
        }
      }

      if (state.selectedGift && key.toString() === 'pattern') {
        updatedGift = {
          ...state.selectedGift,
          pattern: value
        }
      }
  
      // Если фон — обновляем background
      if (state.selectedGift && key.toString() === 'background') {
        const backgrounds = useGiftDataStore.getState().backgrounds
        const newBg = backgrounds?.find((b) => b.name === value)
        if (newBg) {
          updatedGift = {
            ...state.selectedGift,
            background: newBg,
          }
        }
      }
  
      set({
        selectedGift: updatedGift,
      })
    },
}))