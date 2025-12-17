import type { FC } from 'react'
// import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { BadgeCheckIcon, ChevronRightIcon, MessageSquare } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
// import { GiftDrawer } from '@/components/gifts/GiftDrawer'
// import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
// import { ProfileHeader } from '@/components/profile/ProfileHeader'
// import { ProfileCard } from '@/components/profile/ProfileCard'
// import ProfileTabs from '@/components/profile/ProfileTabs'

export const SettingsPage: FC = () => {
//   const lp = useMemo(() => retrieveLaunchParams(), []);
//   const user = lp.tgWebAppData?.user

  return (
    <Page back={true}>
      <div className="w-full">
        <h1 className="m-4 bold text-2xl font-semibold">Settings</h1>
        <div className="mx-4">
          <ItemGroup className="bg-card rounded-xl overflow-hidden">
            <Item size="sm" asChild>
              <a href="#">
                <ItemMedia>
                  <BadgeCheckIcon className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Your profile has been verified.</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </a>
            </Item>
            <Separator />
            <Item size="sm" asChild>
              <a href="https://t.me/dnevnik_ton">
                <ItemMedia>
                  <MessageSquare className="p-1 size-6 bg-[orange] rounded-sm text-white" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Contact Support</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </a>
            </Item>
          </ItemGroup>
        </div>
      </div>
    </Page>
  )
}