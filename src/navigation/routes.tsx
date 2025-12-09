import type { ComponentType, JSX } from 'react'

import { IndexPage } from '@/pages/IndexPage'
import { ExplorePage } from '@/pages/Explore/ExplorePage'

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage, title: 'Home Page' },
  { path: '/explore', Component: ExplorePage, title: 'Explore Page' },
  { path: '/portfolio', Component: IndexPage, title: '' },
  { path: '/indexes', Component: IndexPage, title: '' },
  { path: '/resale', Component: IndexPage, title: '' },
  { path: '/trends', Component: IndexPage, title: '' },
]
