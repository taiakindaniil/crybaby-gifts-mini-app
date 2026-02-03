import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check, Pencil } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { EditBioDialog } from './EditBioDialog'
import type { TelegramUser } from '@/api/user'
import { useTranslation } from '@/i18n'

interface ProfileCardProps {
  user?: TelegramUser;
  isOwnProfile?: boolean;
}

export const ProfileCard: FC<ProfileCardProps> = ({ user, isOwnProfile = false }) => {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const [isEditBioDialogOpen, setIsEditBioDialogOpen] = useState(false)
    const [bio, setBio] = useState(user?.bio || t('profile.defaultBio'))
    
    useEffect(() => {
        if (user?.bio !== undefined) {
            setBio(user.bio || t('profile.defaultBio'))
        }
    }, [user?.bio, t])
    
    // Получаем данные пользователя
    const username = user?.username || ''
    const userLink = username ? `https://t.me/${username}` : (user?.id ? `https://t.me/user${user.id}` : '')
    const displayUsername = username ? `@${username}` : (user?.id ? `user${user.id}` : '')

    const handleCopyLink = () => {
        if (userLink) {
          navigator.clipboard.writeText(userLink)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Card className="py-3 mx-2 mb-4 bg-card/50 border-border shadow-none">
            <CardContent className="px-3">
                <div className="space-y-2">
                    {/* Share Link */}
                    <div className="py-1">
                        <p className="text-sm text-muted-foreground">{t('profile.username')}</p>
                        <div className="flex items-center gap-2">
                        {displayUsername ? (
                            <>
                                <a 
                                    href={userLink} 
                                    className="text-blue-500 text-m hover:underline flex-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {displayUsername}
                                </a>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={handleCopyLink}
                                    disabled={!userLink}
                                >
                                    {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                    <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">{t('profile.noUsername')}</span>
                        )}
                        </div>
                    </div>

                    <Separator />
                    {/* Description */}
                    <div className="py-1">
                        <p className="text-sm text-muted-foreground mb-1">{t('profile.bio')}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-m text-foreground flex-1 break-words overflow-wrap-anywhere overflow-x-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{bio}</p>
                            {isOwnProfile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setIsEditBioDialogOpen(true)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
            {isOwnProfile && (
                <EditBioDialog 
                    open={isEditBioDialogOpen} 
                    onOpenChange={setIsEditBioDialogOpen}
                    currentBio={bio}
                    onBioUpdated={setBio}
                />
            )}
        </Card>
    )
}