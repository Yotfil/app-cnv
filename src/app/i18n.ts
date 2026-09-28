import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from '@/shared/lib/i18n/es.json'

export const defaultNS = 'translation'
export const resources = { es: { translation: es } } as const

void i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  resources,
  // React already escapes interpolated values.
  interpolation: { escapeValue: false },
})

export default i18n
