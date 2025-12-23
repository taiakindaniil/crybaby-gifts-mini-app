import type { FC } from 'react'
import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { GiftDrawer } from '@/components/gifts/GiftDrawer'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileCard } from '@/components/profile/ProfileCard'
import ProfileTabs from '@/components/profile/ProfileTabs'
import { Button } from '@/components/ui/button'
import { Settings } from "lucide-react"
import { Link } from 'react-router-dom';
import { SubscriptionItem } from '@/components/subscription/SubscriptionItem'

export const IndexPage: FC = () => {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const user = lp.tgWebAppData?.user

  return (
    <Page back={false}>
      <div className="w-full">

        <div className="flex mt-2">
          <Button size="lg" variant="ghost" aria-label="settings" className="ml-auto mr-2">
            <Link to="/settings">
              <Settings className="size-5" />
            </Link>
          </Button>
        </div>

        <SubscriptionItem />

        <ProfileHeader user={user} />

        <ProfileCard user={user} />

        <ProfileTabs user={user} />

        <div className="py-5 px-4 text-foreground/50 text-center text-sm">
          Big thanks to <a href="https://t.me/giftchanges" className="text-primary">@giftchanges</a> and <a href="https://t.me/proTON_priTON" className="text-primary">@proTON_priTON</a> for API
        </div>

        <GiftDrawer />
      </div>
    </Page>
  )
}