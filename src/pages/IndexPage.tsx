import type { FC } from 'react'
import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { GiftDrawer } from '@/components/gifts/GiftDrawer'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileCard } from '@/components/profile/ProfileCard'
import ProfileTabs from '@/components/profile/ProfileTabs'

export const IndexPage: FC = () => {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const user = lp.tgWebAppData?.user

  return (
    <Page back={false}>
      <div className="w-screen">

        <ProfileHeader user={user} />

        <ProfileCard user={user} />

        <ProfileTabs user={user} />

        <GiftDrawer />
      </div>
    </Page>
  )
}