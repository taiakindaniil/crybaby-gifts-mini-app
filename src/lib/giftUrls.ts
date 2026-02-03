/**
 * Утилиты для построения URL подарков
 */

import { PROXY_SERVER } from '@/config/env';

const IMAGE_PROXY_SETTING_KEY = 'image-proxy-enabled'

/** Нормализует Unicode-апостроф (U+2019) в ASCII (U+0027) до кодирования URL */
const normalizeApostrophe = (s: string): string => s.replace(/\u2019/g, "'")

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
    return url.replace(/'/g, '%27')
  }
  return `${PROXY_SERVER}?url=${encodeURIComponent(url)}`
}

/**
 * Проксирует URL Lottie файла через сервер
 * Lottie файлы ВСЕГДА загружаются через прокси
 */
export const proxyLottieUrl = (url: string): string => {
  return `${PROXY_SERVER}?url=${encodeURIComponent(url).replace(/'/g, '%27')}`
}

export const buildGiftModelUrl = (giftName: string, model: string): string => {
  const name = normalizeApostrophe(giftName)
  const normalizedModel = normalizeApostrophe(model)
  const url = `https://cdn.changes.tg/gifts/models/${encodeURIComponent(name)}/png/${encodeURIComponent(normalizedModel)}.png`.replace(/'/g, '%27')
  return proxyImageUrl(url)
}

export const buildGiftPatternUrl = (giftName: string, pattern: string): string => {
  const name = normalizeApostrophe(giftName)
  const normalizedPattern = normalizeApostrophe(pattern)
  const url = `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(name)}/png/${encodeURIComponent(normalizedPattern)}.png`.replace(/'/g, '%27')
  return proxyImageUrl(url)
}

export const buildGiftLottieUrl = (giftName: string, model: string): string => {
  const name = normalizeApostrophe(giftName)
  const normalizedModel = normalizeApostrophe(model)
  const url = `https://cdn.changes.tg/gifts/models/${encodeURIComponent(name)}/lottie/${encodeURIComponent(normalizedModel)}.json`.replace(/'/g, '%27')
  return proxyLottieUrl(url)
}

export const buildTelegramGiftUrl = (giftName: string, giftId: number): string => {
  return `https://t.me/nft/${giftName.replace(/\s+/g, '')}-${giftId}`
}

