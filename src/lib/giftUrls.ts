/**
 * Утилиты для построения URL подарков
 */

export const buildGiftModelUrl = (giftName: string, model: string): string => {
  return `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/png/${encodeURIComponent(model)}.png`.replace(/'/g, "%27")
}

export const buildGiftPatternUrl = (giftName: string, pattern: string): string => {
  return `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(giftName)}/png/${encodeURIComponent(pattern)}.png`.replace(/'/g, "%27")
}

export const buildTelegramGiftUrl = (giftName: string, giftId: number): string => {
  return `https://t.me/nft/${giftName.replace(/\s+/g, '')}-${giftId}`
}

