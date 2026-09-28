import { describe, expect, it } from 'vitest'
import pointsFile from '../../../../public/data/points.json?raw'
import regionsFile from '../../../../public/data/regions.json?raw'
import { exportCatalog } from './export'

describe('exportCatalog', () => {
  it('exports the loaded catalog without changes as files identical to the ones in the repository', () => {
    const exported = exportCatalog(JSON.parse(regionsFile), JSON.parse(pointsFile))

    expect(exported.regions).toBe(regionsFile)
    expect(exported.points).toBe(pointsFile)
  })
})
