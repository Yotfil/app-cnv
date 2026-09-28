import { useTranslation } from 'react-i18next'
import { appVersion } from '@/shared/lib/appVersion'

// Placeholder until HomeScreen (task 5.1) takes over the root route.
function App() {
  const { t } = useTranslation()
  return (
    <main>
      <h1>{t('app.title')}</h1>
      <p>{t('app.version', { version: appVersion })}</p>
    </main>
  )
}

export default App
