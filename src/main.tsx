import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import './index.css'
import { App } from './components/App'

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts'
import { init } from './Init.ts'

const root = createRoot(document.getElementById('root')!)

try {
  console.log("Initialize root:", root)
  const launchParams = retrieveLaunchParams();
  console.log("Received lp:", launchParams)
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug')
    || import.meta.env.DEV;
  
  console.log("Received debug:", debug)

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  }).then(() => {
    root.render(
      <StrictMode>
        <App/>
      </StrictMode>,
    );
  })
} catch (e) {
  console.error(e);
  root.render(<div>Error</div>);
}