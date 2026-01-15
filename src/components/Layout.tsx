import { type PropsWithChildren } from 'react'
// import TabBar from '@/components/customized/tabs/tabs'
import { Toaster } from 'sonner';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <main
        className="flex flex-col items-center justify-items-center content-center overflow-y-auto scrollbar-hide overflow-x-hidden w-full h-full pb-20"
        style={{
          paddingTop: 'calc(var(--tg-viewport-content-safe-area-inset-top, 0px) + var(--tg-viewport-safe-area-inset-top, 0px) + 10px)'
        }}
      >
        <div className="mx-auto w-full max-w-[600px]">
          {children}
        </div>
      </main>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <Toaster />
        {/* <TabBar /> */}
      </div>
    </div>
  );
} 