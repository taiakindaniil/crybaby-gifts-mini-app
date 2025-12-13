import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  {
    name: "Explore",
    path: '/explore',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: "Portfolio",
    path: '/portfolio',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12H2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        <path d="M12 2V22" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        <path d="M13 12C13 14.2091 14.7909 16 17 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        <path d="M11 12C11 14.2091 9.20914 16 7 16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        <path d="M12 10.0352C12 8.54529 13.014 7.24659 14.4594 6.88524C16.0631 6.48431 17.5158 7.93697 17.1148 9.5407C16.7535 10.9861 15.4548 12.0001 13.9649 12.0001H12V10.0352Z" stroke="currentColor" strokeWidth={1.5} />
        <path d="M12.0001 10.0352C12.0001 8.54529 10.9861 7.24659 9.5407 6.88524C7.93698 6.48431 6.48431 7.93697 6.88524 9.5407C7.24659 10.9861 8.54529 12.0001 10.0352 12.0001H12.0001V10.0352Z" stroke="currentColor" strokeWidth={1.5} />
        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth={1.5} />
      </svg>      
    ),
  },
  // {
  //   name: "Indexes",
  //   path: '/indexes',
  //   icon: (
  //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  //     </svg>
  //   ),
  // },
  // {
  //   name: "Resale",
  //   path: '/resale',
  //   icon: (
  //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  //     </svg>
  //   ),
  // },
  // {
  //   name: "Trends",
  //   path: '/trends',
  //   icon: (
  //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h2l1-2 2 4 1-2h2" />
  //     </svg>
  //   ),
  // },
];

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (value: string) => {
    if (value !== location.pathname) {
      navigate(value, { replace: false }) // важно, без replace
    }
  }

  return (
    <Tabs
      value={location.pathname}
      onValueChange={handleChange}
      className="fixed bottom-0 left-0 right-0 z-50 pb-[calc(var(--tg-viewport-safe-area-inset-bottom)+5px)] backdrop-blur-md !bg-background/50 [&>div]:!bg-transparent [&>div[data-slot='tabs-list']]:!bg-transparent"
    >
      <TabsList 
        className="tabs-list-transparent h-14 w-full grid grid-cols-2 p-0 justify-start rounded-none"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.path}
            value={tab.path}
            className="!bg-transparent dark:!data-[state=active]:bg-background/50 flex flex-col gap-0 h-full rounded-none !shadow-none !data-[state=active]:shadow-none border-0 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:shrink-0 text-muted-foreground data-[state=active]:text-primary"
          >
            <div className="h-6 w-6 flex items-center justify-center">
              {tab.icon}
            </div>
            <span className="text-xs mt-1 font-medium">
              {tab.name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
