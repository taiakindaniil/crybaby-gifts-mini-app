import type { FC } from 'react'
// import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { BadgeCheckIcon, ChevronRightIcon, Megaphone, CreditCardIcon, MessageSquare, ImageIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSubscription } from '@/hooks/useSubscription'
import { useImageProxySetting } from '@/hooks/useImageProxySetting'
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
  const [isProxyEnabled, setIsProxyEnabled] = useImageProxySetting();

  return (
    <Page back={true}>
      <div className="w-full">
        <h1 className="m-4 mx-6 bold text-2xl font-semibold">Settings</h1>
        <div className="flex flex-col mx-4">
          {settingsButtonGroups.map((group) => (
            <div className="mb-4" key={group.title}>
              <div className="ml-4 mb-2 text-sm text-foreground/50">{group.title}</div>
              <ItemGroup className="bg-card rounded-xl overflow-hidden mt-0">
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

          {/* Development Settings */}
          <div className="mb-4">
            <div className="ml-4 mb-2 text-sm text-foreground/50">Development</div>
            <ItemGroup className="bg-card rounded-xl overflow-hidden mt-0">
              <Item size="sm">
                <ItemMedia>
                  <ImageIcon className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Image Proxy</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <button
                    onClick={() => setIsProxyEnabled(!isProxyEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isProxyEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isProxyEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>
        </div>
      </div>
    </Page>
  )
}