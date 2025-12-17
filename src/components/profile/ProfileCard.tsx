import type { FC } from 'react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ProfileCard: FC = ({ user }) => {
    const [copied, setCopied] = useState(false)
    
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
                        <p className="text-sm text-muted-foreground">username</p>
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
                            <span className="text-sm text-muted-foreground">No username</span>
                        )}
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div className="py-1">
                        <p className="text-sm text-muted-foreground mb-1">bio</p>
                        <p className="text-m text-foreground">What doesn't kill you makes you stronger.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}