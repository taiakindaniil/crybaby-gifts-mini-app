import type { ComponentType, JSX } from 'react'

import { IndexPage } from '@/pages/IndexPage'
import { ExplorePage } from '@/pages/Explore/ExplorePage'
import { SettingsPage } from '@/pages/SettingsPage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { ProfilePage } from '@/pages/ProfilePage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  // { path: '/', Component: IndexPage, title: 'Home Page' },
  { path: '/explore', Component: ExplorePage, title: 'Explore Page' },
  { path: '/portfolio', Component: IndexPage, title: 'Portfolio' },
  { path: '/profile/:userId', Component: ProfilePage, title: 'Profile' },
  { path: '/settings', Component: SettingsPage, title: 'Settings' },
  { path: '/subscription', Component: SubscriptionPage, title: 'Subscription' },
]
