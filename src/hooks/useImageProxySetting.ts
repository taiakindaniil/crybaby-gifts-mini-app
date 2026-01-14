import { useState, useEffect } from 'react'

const IMAGE_PROXY_SETTING_KEY = 'image-proxy-enabled'

/**
 * Хук для управления настройкой проксирования изображений
 * По умолчанию проксирование включено
 */
export const useImageProxySetting = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(IMAGE_PROXY_SETTING_KEY)
    // По умолчанию включено (true), если значение не сохранено
    return stored === null ? true : stored === 'true'
  })

  useEffect(() => {
    localStorage.setItem(IMAGE_PROXY_SETTING_KEY, String(isEnabled))
  }, [isEnabled])

  return [isEnabled, setIsEnabled] as const
}

