import { describe, expect, it } from 'vitest'
import { loadCatalog } from './catalog'
import type { Point, Region } from './model'

const frontBody: Region = {
  id: '6f1c0e8a-3b52-4f7e-9a41-0d2b7c5e9f13',
  key: 'front-body',
  name: 'Cuerpo, de frente',
  view: 'front',
  image: '/img/front-body.png',
  width: 900,
  height: 1600,
  mirror: false,
}

const face: Region = {
  id: 'b8e2d4a1-7c93-4e05-8f6a-2a1d9c3b7e40',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.png',
  width: 1000,
  height: 1000,
  parent: frontBody.id,
  zone: [
    { x: 42, y: 4 },
    { x: 58, y: 4 },
    { x: 58, y: 14 },
    { x: 42, y: 14 },
  ],
  mirror: false,
}

const glabella: Point = {
  id: '0c7a5f2e-9d41-4b83-a6e2-5f1b8d3c9a07',
  key: 'glabella',
  region: face.id,
  side: 'center',
  x: 50,
  y: 30,
  radius: 4,
  meaning: 'Duda',
  alternativeMeanings: [],
  tags: [],
  page: 3,
}

describe('loadCatalog', () => {
  it('returns the regions and points of a valid catalog', async () => {
    const catalog = await loadCatalog(async () => ({
      regions: [frontBody, face],
      points: [glabella],
    }))

    expect(catalog.regions).toEqual([frontBody, face])
    expect(catalog.points).toEqual([glabella])
    expect(catalog.invalidPoints).toEqual([])
  })

  it('leaves out and reports a point whose region does not exist', async () => {
    const orphan: Point = {
      ...glabella,
      id: '9a3e6c1d-2f84-4b57-b0d9-7e5a1c8f4b26',
      key: 'orphan',
      region: 'd41e7b90-5c26-4a18-9f3b-8c0e2a6d5f71',
    }

    const catalog = await loadCatalog(async () => ({
      regions: [frontBody, face],
      points: [glabella, orphan],
    }))

    expect(catalog.points).toEqual([glabella])
    expect(catalog.invalidPoints).toEqual([orphan])
  })

  it('keeps a full-body region with no points as a map', async () => {
    const catalog = await loadCatalog(async () => ({
      regions: [frontBody],
      points: [],
    }))

    expect(catalog.regions).toEqual([frontBody])
    expect(catalog.points).toEqual([])
    expect(catalog.invalidPoints).toEqual([])
  })
})
