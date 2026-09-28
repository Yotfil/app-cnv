import 'i18next'
import type { defaultNS, resources } from './i18n'

// Makes t() keys type-checked against es.json.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['es']
  }
}
