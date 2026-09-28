import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { Catalog } from '../domain/catalog'
import type { Region } from '../domain/model'
import { CatalogContext } from './catalogContext'
import { MapScreen } from './MapScreen'

const frontBody: Region = {
  id: '1d1e7f40-4986-4b2d-8b3f-e522216b7c48',
  key: 'front-body',
  name: 'Cuerpo, de frente',
  view: 'front',
  image: '/img/front-body.png',
  width: 768,
  height: 1376,
  mirror: false,
}

const face: Region = {
  id: 'ccc312f7-a916-4eb8-92dd-e8ad201454eb',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.png',
  width: 1024,
  height: 1024,
  parent: frontBody.id,
  zone: [
    { x: 41, y: 3 },
    { x: 59, y: 20 },
  ],
  mirror: false,
}

// A region of a later change: it has its place on the map but no illustration yet.
const torso: Region = {
  id: '5b0e2c7a-8d14-4f63-9a2b-7c1e3f9d0a48',
  key: 'front-torso',
  name: 'Torso',
  view: 'front',
  width: 768,
  height: 1024,
  parent: frontBody.id,
  zone: [
    { x: 35, y: 21 },
    { x: 65, y: 50 },
  ],
  mirror: false,
}

const OPENED = 'Región abierta'

const catalog: Catalog = { regions: [frontBody, face, torso], points: [], invalidPoints: [] }

function openMap() {
  const router = createMemoryRouter(
    [
      { path: '/map', element: <MapScreen /> },
      { path: '/region/:key', element: <p>{OPENED}</p> },
    ],
    { initialEntries: ['/map'] },
  )
  render(
    <CatalogContext value={{ status: 'ready', catalog }}>
      <RouterProvider router={router} />
    </CatalogContext>,
  )
}

describe('MapScreen', () => {
  it('shows a region without illustration as coming soon and does not open it', async () => {
    const user = userEvent.setup()
    openMap()
    fireEvent.load(screen.getByRole('img', { name: frontBody.name }))

    const soon = screen.getByText('Torso')
    expect(soon.closest('[aria-disabled="true"]')).toHaveTextContent('próximamente')

    await user.click(soon)

    expect(screen.queryByText(OPENED)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cuerpo, de frente' })).toBeInTheDocument()
  })
})
