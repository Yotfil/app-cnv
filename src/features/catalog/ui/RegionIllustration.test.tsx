import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Point, Region } from '../domain/model'
import { RegionIllustration } from './RegionIllustration'

const face: Region & { image: string } = {
  id: 'ccc312f7-a916-4eb8-92dd-e8ad201454eb',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.png',
  width: 1024,
  height: 1024,
  mirror: false,
}

const cheekRight: Point = {
  id: '727fe01b-b4c3-4d97-affe-8cc2d98504b3',
  key: 'cheek-right',
  region: face.id,
  side: 'right',
  x: 39,
  y: 59,
  radius: 4,
  meaning:
    'Queremos morder al otro, el otro nos molesta, nos pone nervioso, nos saca de las casillas.',
  alternativeMeanings: [],
  tags: [],
  page: 4,
}

describe('RegionIllustration', () => {
  it('shows no point until the illustration has loaded', () => {
    render(<RegionIllustration region={face} points={[cheekRight]} />)

    expect(screen.queryByRole('button', { name: cheekRight.meaning })).not.toBeInTheDocument()

    fireEvent.load(screen.getByRole('img', { name: face.name }))

    expect(screen.getByRole('button', { name: cheekRight.meaning })).toBeInTheDocument()
  })

  it('stops waiting and offers to retry when the illustration cannot be loaded', async () => {
    const user = userEvent.setup()
    render(<RegionIllustration region={face} points={[cheekRight]} />)

    fireEvent.error(screen.getByRole('img', { name: face.name }))

    expect(screen.getByText('No se pudo cargar la ilustración.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(screen.queryByText('No se pudo cargar la ilustración.')).not.toBeInTheDocument()
    fireEvent.load(screen.getByRole('img', { name: face.name }))
    expect(screen.getByRole('button', { name: cheekRight.meaning })).toBeInTheDocument()
  })

  it('opens the card when a marker is tapped and closes it when tapping outside', async () => {
    const user = userEvent.setup()
    render(<RegionIllustration region={face} points={[cheekRight]} />)
    fireEvent.load(screen.getByRole('img', { name: face.name }))
    const marker = screen.getByRole('button', { name: cheekRight.meaning })

    await user.pointer({ keys: '[TouchA]', target: marker })

    const card = screen.getByRole('dialog')
    expect(card).toHaveTextContent(cheekRight.meaning)
    expect(card).toHaveTextContent('Lado derecho de la persona')

    await user.pointer({ keys: '[TouchA]', target: document.body })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
