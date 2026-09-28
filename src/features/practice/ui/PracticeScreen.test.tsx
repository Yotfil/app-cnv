import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { CatalogContext, type Catalog, type Point, type Region } from '@/features/catalog'
import { PracticeScreen } from './PracticeScreen'

const face: Region = {
  id: 'ccc312f7-a916-4eb8-92dd-e8ad201454eb',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.png',
  width: 1024,
  height: 1024,
  mirror: false,
}

function point(key: string, meaning: string): Point {
  return {
    id: `id-${key}`,
    key,
    region: face.id,
    side: 'center',
    x: 50,
    y: 50,
    radius: 4,
    meaning,
    alternativeMeanings: [],
    tags: [],
    page: 3,
  }
}

// Texts of láminas 3 and 4 of the PDF.
const catalog: Catalog = {
  regions: [face],
  points: [
    point('forehead-top', 'Reflexiono'),
    point('glabella', 'Necesito indagar'),
    point('below-lip', 'Duda.'),
    point('forehead-right', 'Reflexiono: Esto es complicado'),
  ],
  invalidPoints: [],
}

describe('PracticeScreen', () => {
  it('shows the correction and the point card after choosing an option', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/practice/:key', element: <PracticeScreen /> }], {
      initialEntries: ['/practice/face'],
    })
    render(
      <CatalogContext value={{ status: 'ready', catalog }}>
        <RouterProvider router={router} />
      </CatalogContext>,
    )

    const options = within(screen.getByRole('list', { name: '¿Qué significa?' })).getAllByRole(
      'button',
    )
    expect(options).toHaveLength(4)
    expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument()

    await user.click(options[0])

    const marked = options.filter((option) =>
      within(option).queryByRole('img', { name: 'Correcta' }),
    )
    expect(marked).toHaveLength(1)
    const rightText = marked[0].textContent ?? ''
    expect(screen.getByText(/^(Acertaste|No era ese\.)$/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Ficha del micropicor' })).toHaveTextContent(
      rightText,
    )
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument()
  })
})
