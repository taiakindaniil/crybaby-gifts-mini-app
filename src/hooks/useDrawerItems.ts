import { useMemo } from 'react'
import type { Gift, GiftBackground } from '@/types/gift'
import type { GiftTree } from '@/lib/buildGiftTree'
import { buildGiftModelUrl, buildGiftPatternUrl } from '@/lib/giftUrls'

export type DrawerItem = {
  id: number | string
  title: string
  image?: string
  background?: GiftBackground
  pattern?: string
  url?: string
  gift_number?: number
}

type UseDrawerItemsParams = {
  editingFieldKey: string | null
  selectedGift: Gift | null | undefined
  gifts: string[] | undefined
  backgrounds: GiftBackground[] | undefined
  giftTree: GiftTree
  mode?: 'constructor' | 'freeform'
}

export const useDrawerItems = ({
  editingFieldKey,
  selectedGift,
  gifts,
  backgrounds,
  giftTree,
  mode = 'constructor',
}: UseDrawerItemsParams): DrawerItem[] => {
  return useMemo(() => {
    if (!editingFieldKey) return []

    // В constructor режиме эти поля заполняются из API конструктора в GiftDrawer
    if (mode === 'constructor' && ['gifts', 'model', 'background', 'pattern'].includes(editingFieldKey)) {
      return []
    }

    // GIFTS
    if (editingFieldKey === 'gifts') {
      return (
        gifts?.map((giftName, id) => ({
          id,
          title: giftName,
          image: buildGiftModelUrl(giftName, 'Original'),
        })) ?? []
      )
    }

    if (!selectedGift) return []

    const { name: giftName, model, background } = selectedGift

    if (!giftName) return []

    // MODELS
    if (editingFieldKey === 'model') {
      return Object.keys(giftTree).map((modelName, id) => ({
        id,
        title: modelName,
        image: buildGiftModelUrl(giftName, modelName),
      }))
    }

    if (!model) return []

    // BACKGROUNDS
    if (editingFieldKey === 'background') {
      return Object.keys(giftTree[model]).map((backdropName, id) => ({
        id,
        title: backdropName,
        background: backgrounds?.find((bg) => bg.name === backdropName),
      }))
    }

    // PATTERNS
    if (editingFieldKey === 'pattern') {
      if (mode === 'freeform') {
        // В freeform режиме собираем все уникальные паттерны из всего giftTree
        const allPatterns = new Map<string, { symbol: string; gift_number: number; url: string }>()
        
        // Проходим по всем моделям и фонам
        Object.keys(giftTree).forEach((modelKey) => {
          Object.keys(giftTree[modelKey]).forEach((backdropKey) => {
            const symbols = giftTree[modelKey]?.[backdropKey]?.symbols ?? []
            symbols.forEach((s) => {
              // Используем symbol как ключ, чтобы избежать дубликатов
              if (!allPatterns.has(s.symbol)) {
                allPatterns.set(s.symbol, s)
              }
            })
          })
        })
        
        // Возвращаем все уникальные паттерны без id (id = 0)
        return Array.from(allPatterns.values())
          .filter((s) => s.symbol) // Фильтруем паттерны без symbol
          .map((s) => ({
            id: 0, // В freeform режиме id всегда 0
            title: s.symbol,
            url: s.url,
            gift_number: s.gift_number,
            pattern: buildGiftPatternUrl(giftName, s.symbol),
          }))
      } else {
        // В constructor режиме используем текущую логику
        if (!background) return []
        const symbols = giftTree[model]?.[background.name]?.symbols ?? []
        return symbols
          .filter((s) => s.symbol) // Фильтруем паттерны без symbol
          .map((s) => ({
            id: s.gift_number,
            title: s.symbol,
            url: s.url,
            gift_number: s.gift_number,
            pattern: buildGiftPatternUrl(giftName, s.symbol),
          }))
      }
    }

    return []
  }, [editingFieldKey, selectedGift, gifts, backgrounds, giftTree, mode])
}

