// Checks that the catalog content is the literal text of the course PDF.
// pdf-text.json holds the text of each page (lámina) as extracted with pypdf:
//   PdfReader('../CC_ENTRENAMIENTO DE MICROPICORES.pdf').pages[n - 1].extract_text()
// Add the page there when points from a new page enter the catalog.
import { describe, expect, it } from 'vitest'
import regions from '../../public/data/regions.json'
import points from '../../public/data/points.json'
import { loadCatalog } from '@/features/catalog/domain/catalog'
import type { Point, Region } from '@/features/catalog/domain/model'
import pdfText from './fixtures/pdf-text.json'

/**
 * Accepted differences between the catalog and the PDF: catalog text → PDF text.
 * Only evident typos or agreed adjustments; each one with its reason.
 */
const errata: Record<string, string> = {
  // Lámina 4: the PDF sentence starts with the place ("En la mejilla derecha queremos...");
  // the place is dropped so the option does not reveal the answer, and the capital is restored.
  'Queremos morder al otro': 'queremos morder al otro',
}

const pages = pdfText as Record<string, string>

function normalize(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim()
}

function asInPdf(text: string): string {
  return Object.entries(errata).reduce((t, [catalog, pdf]) => t.replace(catalog, pdf), text)
}

const texts = (points as Point[]).flatMap((point) =>
  [point.meaning, ...point.alternativeMeanings].map((text) => ({
    key: point.key,
    page: point.page,
    text,
  })),
)

describe('catalog content', () => {
  it.each(texts)('$key (lámina $page) is literal: "$text"', ({ page, text }) => {
    const pageText = pages[String(page)]

    expect(pageText, `pdf-text.json has no text for lámina ${page}`).toBeDefined()
    expect(normalize(pageText)).toContain(normalize(asInPdf(text)))
  })

  it('loads with no invalid points', async () => {
    const catalog = await loadCatalog(async () => ({
      regions: regions as Region[],
      points: points as Point[],
    }))

    expect(catalog.invalidPoints).toEqual([])
    expect(catalog.points).toHaveLength(points.length)
  })
})
