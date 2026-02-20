import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useSignal, isMiniAppDark, retrieveLaunchParams } from '@telegram-apps/sdk-react'
import { Layout } from './Layout'

import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/i18n'
import { routes } from '@/navigation/routes'
import { LoadingScreen } from './LoadingScreen'
import { parseProfileUserIdFromStartParam } from '@/lib/parseDeeplink'

function AppRoutes() {
  const navigate = useNavigate();
  const launchParams = retrieveLaunchParams();
  const startParam = launchParams.tgWebAppStartParam;

  useEffect(() => {
    if (startParam) {
      const targetUserId = parseProfileUserIdFromStartParam(startParam);
      if (targetUserId) {
        navigate(`/profile/${targetUserId}`, { replace: true });
      }
    }
  }, []);

  return (
    <Routes>
      {routes.map((route) => <Route key={route.path} {...route} />)}
      <Route path="*" element={<Navigate to="/portfolio" replace />}/>
    </Routes>
  );
}

export function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isDark = useSignal(isMiniAppDark);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <ThemeProvider defaultTheme={isDark ? 'dark' : 'light'} storageKey="vite-ui-theme">
        <I18nProvider>
          <HashRouter>
            <Layout>
              <AppRoutes />
            </Layout>
          </HashRouter>
        </I18nProvider>
      </ThemeProvider>
    </>
  )
}
