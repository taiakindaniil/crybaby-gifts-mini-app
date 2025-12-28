/**
 * Утилиты для построения URL подарков
 */

const PROXY_SERVER = 'https://upright-mighty-colt.ngrok-free.app/proxy/image/'

/**
 * Проксирует URL изображения через сервер
 */
export const proxyImageUrl = (url: string): string => {
  return `${PROXY_SERVER}?url=${encodeURIComponent(url)}`
}

/**
 * Проксирует URL Lottie файла через сервер
 */
export const proxyLottieUrl = (url: string): string => {
  return `${PROXY_SERVER}?url=${encodeURIComponent(url)}`
}

export const buildGiftModelUrl = (giftName: string, model: string): string => {
  const url = `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/png/${encodeURIComponent(model)}.png`.replace(/'/g, "%27")
  return proxyImageUrl(url)
}

export const buildGiftPatternUrl = (giftName: string, pattern: string): string => {
  const url = `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(giftName)}/png/${encodeURIComponent(pattern)}.png`.replace(/'/g, "%27")
  return proxyImageUrl(url)
}

export const buildGiftLottieUrl = (giftName: string, model: string): string => {
  const url = `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/lottie/${encodeURIComponent(model)}.json`
  return proxyLottieUrl(url)
}

export const buildTelegramGiftUrl = (giftName: string, giftId: number): string => {
  return `https://t.me/nft/${giftName.replace(/\s+/g, '')}-${giftId}`
}

