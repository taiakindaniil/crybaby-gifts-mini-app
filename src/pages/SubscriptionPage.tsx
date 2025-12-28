import type { FC } from 'react'
// import { useMemo } from 'react'
import { Page } from '@/components/Page'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { BadgeCheckIcon, EyeOff, Sparkles, GalleryThumbnails } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
// import { BadgeCheckIcon, ChevronRightIcon, MessageSquare } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
// import { GiftDrawer } from '@/components/gifts/GiftDrawer'
// import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
// import { ProfileHeader } from '@/components/profile/ProfileHeader'
// import { ProfileCard } from '@/components/profile/ProfileCard'
// import ProfileTabs from '@/components/profile/ProfileTabs'
import starSvg from '@/assets/star.svg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createInvoice, type Invoice } from '@/api/payment'

import { invoice } from '@telegram-apps/sdk-react'
import { useSubscription, isSubscriptionActive } from '@/hooks/useSubscription'
import useApi from '@/api/hooks/useApi'
import { getSubscriptionPlans, type SubscriptionPlan } from '@/api/subscription'
import { proxyImageUrl } from '@/lib/giftUrls'
import { ProxiedImage } from '@/components/ui/ProxiedImage'

const subscriptionItems = [
  {
    title: 'Premium badge',
    description: 'Show premium badge in your profile',
    link: '/subscription',
    icon: <BadgeCheckIcon className="size-5 text-blue-500" />,
  },
  {
    title: 'Multiple Collections',
    description: 'Access to multiple collections',
    link: '/subscription',
    icon: <GalleryThumbnails className="size-5 text-blue-500" />,
  },
  {
    title: 'Hidden collections',
    description: 'Hide collections from public view',
    link: '/subscription',
    icon: <EyeOff className="size-5 text-blue-500" />,
  },
  {
    title: 'More soon...',
    description: 'Get access to exclusive features',
    link: '/subscription',
    icon: <Sparkles className="size-5 text-blue-500" />,
  }
]

export const SubscriptionPage: FC = () => {
//   const lp = useMemo(() => retrieveLaunchParams(), []);
//   const user = lp.tgWebAppData?.user

  const api = useApi();
  const { data: subscription } = useSubscription();
  const hasActiveSubscription = isSubscriptionActive(subscription);

  const queryClient = useQueryClient();

  const { data: subscriptionPlans, isLoading: isSubscriptionPlansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['subscriptionPlans'],
    queryFn: getSubscriptionPlans,
  })

  const subscriptionPlan = subscriptionPlans?.[0];

  const createInvoiceMutation = useMutation({
    mutationFn: () => createInvoice(subscriptionPlan?.id ?? 1),
    onSuccess: (data: Invoice) => {
      invoice.open(data.invoice_link, 'url').then((status) => {
        if (status == 'paid') {
          // TODO: invalidate subscription
          queryClient.invalidateQueries({ queryKey: ['subscription'] })
        }
      })
      queryClient.invalidateQueries({ queryKey: ['invoice'] })
    },
    onError: () => {
      toast("Error", {
        description: 'Failed to create invoice',
      })
    },
  })

  return (
    <Page back={true}>
      <div className="w-full">
        <ProxiedImage src={proxyImageUrl("https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Sunset.png")} alt="Premium" className="mt-8 w-24 h-24 mx-auto" />
        <h1 className="m-4 bold text-2xl font-semibold text-center">Exclusive features</h1>
        <ItemGroup className="bg-card rounded-xl overflow-hidden mx-4">
          {subscriptionItems.map((item) => (
            <Item size="default" asChild key={item.title}>
              <Link to={item.link} className="flex relative cursor-pointer">
                <ItemMedia>
                  {item.icon}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {item.title}
                  </ItemTitle>
                  <ItemDescription className="text-md">
                    {item.description}
                  </ItemDescription>
                </ItemContent>
              </Link>
            </Item>
          ))}
        </ItemGroup>
        <div className="mx-4 mt-4">
          {hasActiveSubscription ? (
            <div className="rounded-full h-12 w-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
              <span className="text-sm font-medium text-green-500">
                Subscription is active until {new Date(subscription?.end_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <Button className="rounded-full h-12 w-full cursor-pointer" onClick={() => createInvoiceMutation.mutate()}>
              {createInvoiceMutation.isPending || isSubscriptionPlansLoading ? <Spinner className="text-white" /> : <>
                <span className="text-sm font-medium text-white">
                  Get monthly subscription for <img src={starSvg} alt="stars" className="mt-[-2px] size-5 inline-block" />{subscriptionPlan?.price}
                </span>
              </>}
            </Button>
          )}
        </div>
      </div>
    </Page>
  )
}