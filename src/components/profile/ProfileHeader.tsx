import type { FC } from 'react'
import { useMemo } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BadgeCheckIcon } from 'lucide-react'
import { useHasActiveSubscription } from '@/hooks/useSubscription'
import { useQuery } from '@tanstack/react-query'
import { getGrids } from '@/api/gifts'
import { buildGiftModelUrl } from '@/lib/giftUrls'
import { ProxiedImage } from '@/components/ui/ProxiedImage'
import { ProfileViewCounter } from './ProfileViewCounter'
import type { Gift } from '@/types/gift'

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  subscription_active?: boolean;
  view_count?: number;
  unique_view_count?: number;
}

interface ProfileHeaderProps {
  user?: TelegramUser;
  isOwnProfile?: boolean;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ user, isOwnProfile = false }) => {
    // Получаем данные пользователя
    const userName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : 'User'
    const userInitials = user 
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U'
        : 'U'

    // Получаем статус подписки
    // Для собственного профиля используем хук, для чужого - данные из user
    const subscriptionStatus = useHasActiveSubscription();
    const hasActiveSubscription = isOwnProfile 
        ? subscriptionStatus 
        : (user?.subscription_active ?? false);

    // Получаем гриды пользователя
    const { data: grids = [] } = useQuery({
        queryKey: ['grids', user?.id],
        queryFn: () => getGrids(user!.id),
        enabled: !!user?.id,
    })

    // Извлекаем только закрепленные подарки с моделями из main album (первый grid)
    // Берем по порядку из первых двух рядов (rows 0-1, cells 0-2)
    const giftModels = useMemo(() => {
        if (grids.length === 0) return []
        
        const mainAlbum = grids[0] // Первый grid - это main album
        const pinnedGifts: Gift[] = []
        
        // Собираем закрепленные подарки с моделями из первых двух рядов по порядку
        for (let rowIdx = 0; rowIdx < 2 && pinnedGifts.length < 6; rowIdx++) {
            const row = mainAlbum.rows[rowIdx]
            if (!row) continue
            
            for (let cellIdx = 0; cellIdx < 3 && cellIdx < row.cells.length && pinnedGifts.length < 6; cellIdx++) {
                const cell = row.cells[cellIdx]
                // Берем только закрепленные подарки с моделями
                if (cell && cell.gift && cell.gift.model && cell.pinned) {
                    pinnedGifts.push(cell.gift)
                }
            }
        }
        
        // Возвращаем до 6 закрепленных подарков
        return pinnedGifts.slice(0, 6)
    }, [grids])

    // Генерируем случайные позиции для подарков в пределах заданных диапазонов
    const giftPositions = useMemo(() => {
        if (giftModels.length === 0) return []
        
        // Диапазоны для каждой позиции: 3 справа, 3 слева
        const positionRanges = [
            // Справа (положительный x)
            { xMin: 80, xMax: 125, yMin: -40, yMax: -20 },   // верхний правый
            { xMin: 75, xMax: 125, yMin: -20, yMax: 20 },      // средний правый
            { xMin: 115, xMax: 125, yMin: 20, yMax: 60 },   // нижний правый
            // Слева (отрицательный x)
            { xMin: -90, xMax: -125, yMin: -40, yMax: -20 }, // верхний левый
            { xMin: -105, xMax: -125, yMin: -20, yMax: 20 },   // средний левый
            { xMin: -115, xMax: -125, yMin: 20, yMax: 60 }, // нижний левый
        ]
        
        // Генерируем случайные позиции для каждого подарка
        return giftModels.map((_, index) => {
            const range = positionRanges[index] || { xMin: 0, xMax: 0, yMin: 0, yMax: 0 }
            const randomX = Math.random() * (range.xMax - range.xMin) + range.xMin
            const randomY = Math.random() * (range.yMax - range.yMin) + range.yMin
            
            return {
                x: Math.round(randomX),
                y: Math.round(randomY),
            }
        })
    }, [giftModels])

    return (
        <div className="flex flex-col items-center px-4 pt-6 pb-4">
            <div className="relative flex justify-center items-center mb-4 w-full">
                <Avatar className="w-28 h-28 border-2 border-background">
                    <AvatarImage src={user?.photo_url} alt={userName} />
                    <AvatarFallback className="text-3xl bg-muted text-foreground">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                
                {/* Изображения подарков вокруг аватарки */}
                {giftModels.length > 0 && giftPositions.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full">
                        {giftModels.map((gift, index) => {
                            const pos = giftPositions[index]
                            if (!pos) return null
                            
                            // Разные анимации для разных элементов для более естественного эффекта
                            const animations = ['float', 'float-2', 'float-3']
                            const animationName = animations[index % animations.length]
                            const animationDuration = 3 + (index % 3) * 0.5 // 3s, 3.5s, 4s
                            
                            return (
                                <div
                                    key={`${gift.id}-${gift.model}`}
                                    className="absolute"
                                    style={{
                                        left: `calc(50% + ${pos.x}px)`,
                                        top: `calc(50% + ${pos.y}px)`,
                                        animation: `${animationName} ${animationDuration}s ease-in-out infinite`,
                                    }}
                                >
                                    <ProxiedImage
                                        src={buildGiftModelUrl(gift.name, gift.model!)}
                                        alt={`${gift.name} ${gift.model}`}
                                        className="w-8 h-8 object-contain gift-glow"
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{userName}</h1>
                {hasActiveSubscription && (
                    <div className="flex items-center">
                        <BadgeCheckIcon className="w-5 h-5 text-blue-500" />
                    </div>
                )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
                {isOwnProfile ? 'online' : 'last seen recently'}
            </p>
            
            <ProfileViewCounter 
                viewCount={user?.view_count}
                uniqueViewCount={user?.unique_view_count}
            />
        </div>
    )
}