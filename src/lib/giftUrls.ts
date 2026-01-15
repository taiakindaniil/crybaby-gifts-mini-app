/**
 * Утилиты для построения URL подарков
 */

import { PROXY_SERVER } from '@/config/env';

const IMAGE_PROXY_SETTING_KEY = 'image-proxy-enabled'

/**
 * Проверяет, включено ли проксирование изображений
 */
const isImageProxyEnabled = (): boolean => {
  const stored = localStorage.getItem(IMAGE_PROXY_SETTING_KEY)
  // По умолчанию включено (true), если значение не сохранено
  return stored === null ? true : stored === 'true'
}

/**
 * Проксирует URL изображения через сервер
 * Если проксирование отключено, возвращает оригинальный URL
 */
export const proxyImageUrl = (url: string): string => {
  if (!isImageProxyEnabled()) {
    return url
  }
  return `${PROXY_SERVER}?url=${encodeURIComponent(url)}`
}

/**
 * Проксирует URL Lottie файла через сервер
 * Lottie файлы ВСЕГДА загружаются через прокси
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

