import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

// Checks that Vitest, jsdom, React Testing Library and jest-dom are wired together.
describe('test tooling', () => {
  it('renders into jsdom and queries with Testing Library', () => {
    render(createElement('p', null, 'smoke'))

    expect(screen.getByText('smoke')).toBeInTheDocument()
  })
})
