import { useState, useEffect } from 'react'
import useApi from '@/api/hooks/useApi'
import { loadAndCacheImage, isNgrokUrl } from '@/lib/imageCache'
import { useImageProxySetting } from '@/hooks/useImageProxySetting'

/**
 * Хук для загрузки изображения
 * Для ngrok URL использует прокси с blob для обхода предупреждения
 * Для обычных URL возвращает URL напрямую (браузер кэширует автоматически)
 * 
 * Возвращает URL для использования в backgroundImage или других CSS свойствах
 */
export const useProxiedImageUrl = (url: string | null | undefined): string | null => {
  const [isProxyEnabled] = useImageProxySetting()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const api = useApi()

  useEffect(() => {
    if (!url) {
      setImageUrl(null)
      return
    }

    // Если проксирование отключено или это не ngrok URL, возвращаем URL напрямую
    // Браузер автоматически кэширует такие изображения
    if (!isProxyEnabled || !isNgrokUrl(url)) {
      setImageUrl(url)
      return
    }

    // Для ngrok URL используем blob с кэшированием
    let cancelled = false

    // Загружаем изображение через useApi с обходом предупреждения ngrok
    const loadImage = async () => {
      try {
        // Извлекаем путь из полного URL для использования с apiClient
        const urlObj = new URL(url)
        const path = urlObj.pathname + urlObj.search

        // Используем loadAndCacheImage для кэширования и защиты от параллельных загрузок
        const blobUrl = await loadAndCacheImage(url, async () => {
          const response = await api.get(path, {
            responseType: 'blob',
          })
          return response.data as Blob
        })

        // Проверяем, не был ли эффект отменен во время загрузки
        if (cancelled) {
          return
        }

        setImageUrl(blobUrl)
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading proxied image:', err)
          setImageUrl(null)
        }
      }
    }

    loadImage()

    // Очищаем blob URL при размонтировании или изменении URL
    // Примечание: blob URL не нужно освобождать, так как он управляется кэшем
    return () => {
      cancelled = true
    }
  }, [url, api, isProxyEnabled])

  return imageUrl
}

