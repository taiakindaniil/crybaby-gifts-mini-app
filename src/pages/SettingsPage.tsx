import type { FC } from 'react'
// import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { BadgeCheckIcon, ChevronRightIcon, Megaphone, CreditCardIcon, MessageSquare } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSubscription } from '@/hooks/useSubscription'
// import { GiftDrawer } from '@/components/gifts/GiftDrawer'
// import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
// import { ProfileHeader } from '@/components/profile/ProfileHeader'
// import { ProfileCard } from '@/components/profile/ProfileCard'
// import ProfileTabs from '@/components/profile/ProfileTabs'

import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const settingsButtonGroups = [
  {
    title: 'Account',
    items: [
      {
        title: 'Subscription',
        icon: <CreditCardIcon className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />,
        link: '/subscription',
        external: false,
      },
    ],
  },
  {
    title: 'Links',
    items: [
      {
        title: 'Contact Support',
        icon: <MessageSquare className="p-1 size-6 bg-[orange] rounded-sm text-white" />,
        link: 'https://t.me/dnevnik_ton',
        external: true,
      },
      {
        title: 'Telegram Channel',
        icon: <Megaphone className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />,
        link: 'https://t.me/dnevnik_ton',
        external: true,
      }
    ],
  },
];

export const SettingsPage: FC = () => {
//   const lp = useMemo(() => retrieveLaunchParams(), []);
//   const user = lp.tgWebAppData?.user

  const { data: subscription, isLoading, error } = useSubscription();

  return (
    <Page back={true}>
      <div className="w-full">
        <h1 className="m-4 mx-6 bold text-2xl font-semibold">Settings</h1>
        <div className="flex flex-col mx-4">
          {settingsButtonGroups.map((group) => (
            <div className="mb-4">
              <div className="ml-4 mb-2 text-sm text-foreground/50">{group.title}</div>
              <ItemGroup key={group.title} className="bg-card rounded-xl overflow-hidden mt-0">
                {group.items.map((item, index) => (
                  <>
                    <Item size="sm" asChild key={item.title}>
                      <Link to={item.link}>
                        <ItemMedia>
                          {item.icon}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{item.title}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <ChevronRightIcon className="size-4" />
                        </ItemActions>
                      </Link>
                    </Item>
                    {index < group.items.length - 1 && <Separator />}
                  </>
                ))}
              </ItemGroup>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}