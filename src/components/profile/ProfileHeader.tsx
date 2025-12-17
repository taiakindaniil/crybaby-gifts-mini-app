import type { FC } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BadgeCheckIcon, Check } from 'lucide-react'

export const ProfileHeader: FC = ({ user }) => {
    // Получаем данные пользователя
    const userName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : 'User'
    const userInitials = user 
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U'
        : 'U'

    return (
        <div className="flex flex-col items-center px-4 pt-6 pb-4">
            <div className="relative mb-4">
            <Avatar className="w-28 h-28 border-2 border-background">
                <AvatarImage src={user?.photo_url} alt={userName} />
                <AvatarFallback className="text-3xl bg-muted text-foreground">
                {userInitials}
                </AvatarFallback>
            </Avatar>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-foreground">{userName}</h1>
            {user?.is_premium && (
                <div className="flex items-center">
                <BadgeCheckIcon className="w-5 h-5 text-blue-500" />
                </div>
            )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">online</p>
        </div>
    )
}