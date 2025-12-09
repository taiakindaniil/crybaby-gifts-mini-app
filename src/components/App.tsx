import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSignal, isMiniAppDark } from '@telegram-apps/sdk-react'
import { Layout } from './Layout'

import { ThemeProvider } from '@/components/theme-provider'
import { routes } from '@/navigation/routes'

export function App() {
  const isDark = useSignal(isMiniAppDark);

  return (
    <>
      <ThemeProvider defaultTheme={isDark ? 'dark' : 'light'} storageKey="vite-ui-theme">
        <HashRouter>
          <Layout>
            <Routes>
              {routes.map((route) => <Route key={route.path} {...route} />)}
              <Route path="*" element={<Navigate to="/" />}/>
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </>
  )
}
