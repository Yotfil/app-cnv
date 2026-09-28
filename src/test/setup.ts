import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
// Components read their texts from es.json through react-i18next.
import '@/app/i18n'

afterEach(() => {
  cleanup()
})
