import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { useHasActiveSubscription } from '@/hooks/useSubscription'
import { Eye } from 'lucide-react'

interface ProfileViewCounterProps {
  viewCount?: number
  uniqueViewCount?: number
}

/**
 * Компонент для отображения счетчика просмотров профиля
 * Для пользователей с подпиской показывает счетчик
 * Для пользователей без подписки показывает скрытый элемент, при клике открывающий страницу подписки
 */
export const ProfileViewCounter: FC<ProfileViewCounterProps> = ({ 
  viewCount = 0, 
  uniqueViewCount = 0 
}) => {
  const hasActiveSubscription = useHasActiveSubscription()

  // Форматируем числа с разделителями тысяч
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
  }

  // Если у пользователя есть подписка, показываем счетчик
  if (hasActiveSubscription) {
    return (
    <div className="flex items-center justify-center gap-2">
        {/* <Eye className="w-3 h-3" /> */}
        <span className="text-sm text-muted-foreground">
            {formatNumber(viewCount)} views ({formatNumber(uniqueViewCount)} unique)
        </span>
    </div>
    )
  }

  // Для пользователей без подписки показываем скрытый элемент с возможностью клика
  return (
    <Link 
      to="/subscription" 
      className="flex items-center justify-center gap-1 text-sm text-muted-foreground/50 mb-4 cursor-pointer hover:text-muted-foreground transition-colors"
    >
      <Eye className="w-3 h-3" />
      <span className="blur-sm select-none">••• views (••• unique)</span>
    </Link>
  )
}

