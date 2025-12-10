import { create } from 'zustand'
import type { GiftBackground } from '@/types/gift'

type Model = {
  name: string
  rarityPermille: number
}

type GiftDataStore = {
  gifts: string[] | null
  models: Record<string, Model[]>
  backgrounds: GiftBackground[] | null
  patterns: string[] | null

  fetchGifts: () => Promise<void>
  fetchModels: (giftName: string) => Promise<void>
  fetchBackgrounds: () => Promise<void>
  fetchPatterns: (giftName: string) => Promise<void>
  prefetchStatic: () => Promise<void>
}

export const useGiftDataStore = create<GiftDataStore>((set, get) => ({
  gifts: null,
  backgrounds: null,
  models: {},
  patterns: null,

  fetchGifts: async () => {
    if (get().gifts) return // КЭШ
    const res = await fetch('https://api.changes.tg/gifts')
    const json = await res.json()
    set({ gifts: json })
  },

  fetchModels: async (giftName: string) => {
    const cache = get().models[giftName]
    if (cache) return // КЭШ

    const url = `https://api.changes.tg/models/${encodeURIComponent(giftName)}`
    const res = await fetch(url)
    const json = await res.json()

    set({
      models: {
        ...get().models,
        [giftName]: json,
      },
    })
  },

  fetchBackgrounds: async () => {
    if (get().backgrounds) return // КЭШ
    const res = await fetch('https://api.changes.tg/backdrops?sort=asc')
    const json = await res.json()
    set({ backgrounds: json })
  },

  fetchPatterns: async (giftName: string) => {
    if (get().patterns) return // КЭШ
    const res = await fetch(`https://api.changes.tg/patterns/${encodeURIComponent(giftName)}`)
    const json = await res.json()
    set({ patterns: json })
  },

  /** Prefetching when opening GiftDrawer */
  prefetchStatic: async () => {
    const state = get()

    // параллельно
    await Promise.all([
      state.fetchGifts(),
      state.fetchBackgrounds(),
    ])
  },
}))
