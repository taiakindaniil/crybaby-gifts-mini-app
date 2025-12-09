import type { FC } from 'react'
import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { GiftDrawer } from '@/components/gifts/GiftDrawer'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileCard } from '@/components/profile/ProfileCard'
import ProfileTabs from '@/components/profile/ProfileTabs'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useGiftStore } from '@/stores/giftStore'
import { Input } from '@/components/ui/input'
import { SearchDrawer } from '@/components/search/SearchDrawer'

export const IndexPage: FC = () => {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const user = lp.tgWebAppData?.user

  const selectedGift = useGiftStore((state) => state.selectedGift)

  return (
    <Page back={false}>
      <div className="w-screen">

        <ProfileHeader user={user} />

        <ProfileCard user={user} />

        <ProfileTabs />

        <GiftDrawer />

        <SearchDrawer items={
          [
            {
              id: 0,
              title: "hello"
            },
            {
              id: 1,
              title: "word"
            },
            {
              id: 2,
              title: "hello"
            },
            {
              id: 3,
              title: "hello"
            },
            {
              id: 0,
              title: "hello"
            },
            {
              id: 1,
              title: "word"
            },
            {
              id: 2,
              title: "hello"
            },
            {
              id: 3,
              title: "hello"
            },
          ]
        } />
      </div>
    </Page>
  )
}