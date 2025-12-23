import { useQuery } from '@tanstack/react-query'
import { getMySubscription, type MySubscription } from '@/api/subscription'

/**
 * Hook для получения данных подписки пользователя
 */
export const useSubscription = () => {
  return useQuery<MySubscription>({
    queryKey: ['subscription'],
    queryFn: getMySubscription,
    retry: false, // Не повторять запрос при ошибке (если подписки нет, API может вернуть 404)
  })
}

/**
 * Утилита для проверки, активна ли подписка
 * Подписка считается активной, если end_date еще не наступил
 */
export const isSubscriptionActive = (subscription: MySubscription | null | undefined): boolean => {
  if (!subscription) {
    return false
  }

  const endDate = new Date(subscription.end_date)
  const now = new Date()
  
  return endDate > now
}

/**
 * Hook для проверки наличия активной подписки
 * Возвращает boolean значение
 */
export const useHasActiveSubscription = (): boolean => {
  const { data: subscription } = useSubscription()
  return isSubscriptionActive(subscription)
}

