import { useState, useEffect, type ImgHTMLAttributes } from 'react'
import useApi from '@/api/hooks/useApi'
import { loadAndCacheImage, isNgrokUrl } from '@/lib/imageCache'
import { useImageProxySetting } from '@/hooks/useImageProxySetting'

type ProxiedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

/**
 * Компонент для загрузки изображений
 * Для ngrok URL использует прокси с blob для обхода предупреждения
 * Для обычных URL использует прямой <img> с браузерным кэшем (отображается сразу)
 */
export const ProxiedImage: React.FC<ProxiedImageProps> = ({ src, ...imgProps }) => {
  const [isProxyEnabled] = useImageProxySetting()
  const isNgrok = isNgrokUrl(src)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const api = useApi()

  useEffect(() => {
    // Если проксирование отключено или это не ngrok URL, ничего не делаем - используем src напрямую
    if (!isProxyEnabled || !isNgrok) {
      return
    }

    let cancelled = false

    // Загружаем изображение через useApi с обходом предупреждения ngrok
    const loadImage = async () => {
      try {
        // Извлекаем путь из полного URL для использования с apiClient
        const url = new URL(src)
        const path = url.pathname + url.search

        // Используем loadAndCacheImage для кэширования и защиты от параллельных загрузок
        const blobUrl = await loadAndCacheImage(src, async () => {
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
        setError(false)
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading proxied image:', err)
          setError(true)
        }
      }
    }

    loadImage()

    // Очищаем blob URL при размонтировании или изменении src
    // Примечание: blob URL не нужно освобождать, так как он управляется кэшем
    return () => {
      cancelled = true
    }
  }, [src, api, isNgrok, isProxyEnabled])

  // Если проксирование отключено или это не ngrok URL, сразу возвращаем обычный img
  // Браузер автоматически кэширует такие изображения
  if (!isProxyEnabled || !isNgrok) {
    return <img {...imgProps} src={src} />
  }

  // Для ngrok URL показываем состояние загрузки
  if (error) {
    return <img {...imgProps} src="" alt={imgProps.alt || ''} style={{ opacity: 0 }} />
  }

  if (!imageUrl) {
    return <div className={imgProps.className} style={{ ...imgProps.style, backgroundColor: 'transparent' }} />
  }

  return <img {...imgProps} src={imageUrl} />
}

