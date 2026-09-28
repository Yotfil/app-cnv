import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { CatalogContext, type Catalog, type Point, type Region } from '@/features/catalog'
import { createMemoryStore } from '@/shared/lib/storage/memoryStore'
import type { Progress } from '../domain/model'
import { ProgressProvider } from './ProgressProvider'
import { ProgressScreen } from './ProgressScreen'

const face: Region = {
  id: 'ccc312f7-a916-4eb8-92dd-e8ad201454eb',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.webp',
  width: 1024,
  height: 1024,
  mirror: false,
}

// Text of lámina 3 of the PDF.
const glabella: Point = {
  id: 'id-glabella',
  key: 'glabella',
  region: face.id,
  side: 'center',
  x: 50,
  y: 27,
  radius: 4,
  meaning: 'Necesito indagar',
  alternativeMeanings: [],
  tags: [],
  page: 3,
}

const catalog: Catalog = { regions: [face], points: [glabella], invalidPoints: [] }

describe('ProgressScreen', () => {
  it('lists the points of a region and opens the card of the one tapped', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/progress', element: <ProgressScreen /> }], {
      initialEntries: ['/progress'],
    })
    render(
      <ProgressProvider store={createMemoryStore<Progress>()}>
        <CatalogContext value={{ status: 'ready', catalog }}>
          <RouterProvider router={router} />
        </CatalogContext>
      </ProgressProvider>,
    )

    expect(screen.getByText(/practicados 0 de 1/)).toBeInTheDocument()
    const row = screen.getByRole('button', { name: /Necesito indagar/ })
    expect(row).toHaveTextContent('sin practicar')

    await user.click(row)

    expect(screen.getByRole('dialog', { name: 'Ficha del micropicor' })).toHaveTextContent(
      'Necesito indagar',
    )
  })
})
