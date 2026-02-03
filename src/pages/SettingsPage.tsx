import type { FC } from 'react'
// import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { BadgeCheckIcon, ChevronRightIcon, Megaphone, CreditCardIcon, MessageSquare, ImageIcon, Languages } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSubscription } from '@/hooks/useSubscription'
import { useImageProxySetting } from '@/hooks/useImageProxySetting'
import { useTranslation, type Locale } from '@/i18n'
// import { GiftDrawer } from '@/components/gifts/GiftDrawer'
// import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
// import { ProfileHeader } from '@/components/profile/ProfileHeader'
// import { ProfileCard } from '@/components/profile/ProfileCard'
// import ProfileTabs from '@/components/profile/ProfileTabs'

import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const SettingsPage: FC = () => {
  const { t, locale, setLocale } = useTranslation()
  const { data: subscription, isLoading, error } = useSubscription()
  const [isProxyEnabled, setIsProxyEnabled] = useImageProxySetting()

  const settingsButtonGroups = [
    {
      title: t('settings.account'),
      items: [
        {
          title: t('settings.subscription'),
          icon: <CreditCardIcon className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />,
          link: '/subscription',
          external: false,
        },
      ],
    },
    {
      title: t('settings.links'),
      items: [
        {
          title: t('settings.contactSupport'),
          icon: <MessageSquare className="p-1 size-6 bg-[orange] rounded-sm text-white" />,
          link: 'https://t.me/dnevnik_ton',
          external: true,
        },
        {
          title: t('settings.telegramChannel'),
          icon: <Megaphone className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />,
          link: 'https://t.me/dnevnik_ton',
          external: true,
        },
      ],
    },
  ]

  return (
    <Page back={true}>
      <div className="w-full">
        <h1 className="m-4 mx-6 bold text-2xl font-semibold">{t('settings.title')}</h1>
        <div className="flex flex-col mx-4">
          {/* Language */}
          <div className="mb-4">
            <div className="ml-4 mb-2 text-sm text-foreground/50">{t('settings.language')}</div>
            <ItemGroup className="bg-card rounded-xl overflow-hidden mt-0">
              <Item size="sm">
                <ItemMedia>
                  <Languages className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t('settings.languageDesc')}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                    <SelectTrigger className="w-[120px] border-0 bg-transparent shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>

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
            <div className="ml-4 mb-2 text-sm text-foreground/50">{t('settings.development')}</div>
            <ItemGroup className="bg-card rounded-xl overflow-hidden mt-0">
              <Item size="sm">
                <ItemMedia>
                  <ImageIcon className="p-1 size-6 bg-[#72aee6] rounded-sm text-white" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t('settings.imageProxy')}</ItemTitle>
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