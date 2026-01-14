/**
 * Система кэширования изображений
 * 
 * Примечание: Браузер автоматически кэширует изображения через HTTP-кэш,
 * но в данном случае изображения загружаются через axios с responseType: 'blob'
 * для обхода предупреждения ngrok, что может обходить браузерный кэш.
 * 
 * Для обычных URL (без ngrok) используется прямой <img src="..."> с браузерным кэшем.
 * Для ngrok URL используется blob с дополнительным кэшированием.
 */

/**
 * Проверяет, содержит ли URL ngrok
 */
export function isNgrokUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('ngrok') || urlObj.hostname.includes('ngrok-free.app')
  } catch {
    return false
  }
}

// Отслеживание активных загрузок для предотвращения параллельных запросов
const loadingPromises = new Map<string, Promise<string>>()

// Кэш blob URL в памяти для быстрого доступа
// Браузерный HTTP-кэш работает автоматически, но blob URL нужно создавать заново
const blobUrlCache = new Map<string, string>()

/**
 * Получает blob URL из кэша памяти
 * @param url - URL изображения
 * @returns blob URL или null, если не найден
 */
export async function getCachedImage(url: string): Promise<string | null> {
  return blobUrlCache.get(url) || null
}

/**
 * Сохраняет blob URL в кэш памяти
 * @param url - URL изображения
 * @param blobUrl - blob URL для сохранения
 */
export function cacheBlobUrl(url: string, blobUrl: string): void {
  blobUrlCache.set(url, blobUrl)
}

/**
 * Загружает изображение с кэшированием и защитой от параллельных загрузок
 * 
 * Браузер автоматически кэширует HTTP-запросы, но поскольку мы используем
 * axios с responseType: 'blob', нужно вручную управлять blob URL.
 * 
 * @param url - URL изображения
 * @param loadFn - Функция для загрузки изображения (возвращает Blob)
 * @returns blob URL для использования
 */
export async function loadAndCacheImage(
  url: string,
  loadFn: () => Promise<Blob>
): Promise<string> {
  // Проверяем кэш blob URL в памяти
  const cached = await getCachedImage(url)
  if (cached) {
    return cached
  }

  // Проверяем, не загружается ли уже это изображение
  const existingPromise = loadingPromises.get(url)
  if (existingPromise) {
    return existingPromise
  }

  // Создаем промис для загрузки
  const loadPromise = (async () => {
    try {
      // Браузер автоматически использует HTTP-кэш для запроса
      const blob = await loadFn()
      
      // Проверяем еще раз на случай параллельных загрузок
      const existing = blobUrlCache.get(url)
      if (existing) {
        return existing
      }

      // Создаем blob URL и сохраняем в кэш
      const blobUrl = URL.createObjectURL(blob)
      cacheBlobUrl(url, blobUrl)
      
      return blobUrl
    } finally {
      // Удаляем промис из Map после завершения загрузки
      loadingPromises.delete(url)
    }
  })()

  // Сохраняем промис для других запросов
  loadingPromises.set(url, loadPromise)

  return loadPromise
}

/**
 * Очищает кэш blob URL в памяти
 * Примечание: Браузерный HTTP-кэш очищается автоматически браузером
 * в соответствии с заголовками Cache-Control и политикой браузера
 */
export async function clearImageCache(): Promise<void> {
  // Очищаем blob URL в памяти
  blobUrlCache.forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl)
  })
  blobUrlCache.clear()
  loadingPromises.clear()
}

/**
 * Получает количество закэшированных blob URL в памяти
 */
export async function getCacheSize(): Promise<number> {
  return blobUrlCache.size
}

