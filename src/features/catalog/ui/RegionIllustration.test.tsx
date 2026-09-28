import { render, screen } from '@testing-library/react'
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
  it('opens the card when a marker is tapped and closes it when tapping outside', async () => {
    const user = userEvent.setup()
    render(<RegionIllustration region={face} points={[cheekRight]} />)
    const marker = screen.getByRole('button', { name: cheekRight.meaning })

    await user.pointer({ keys: '[TouchA]', target: marker })

    const card = screen.getByRole('dialog')
    expect(card).toHaveTextContent(cheekRight.meaning)
    expect(card).toHaveTextContent('Lado derecho de la persona')

    await user.pointer({ keys: '[TouchA]', target: document.body })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
