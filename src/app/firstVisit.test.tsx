import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { HomeScreen } from '@/features/onboarding'
import { ProgressProvider, type Progress } from '@/features/progress'
import { createMemoryStore } from '@/shared/lib/storage/memoryStore'
import { AppLayout } from './AppLayout'

const STUDY = 'Estudio de la cara'

function openApp(store: ReturnType<typeof createMemoryStore<Progress>>, path: string) {
  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomeScreen studyPath="/region/face" /> },
          { path: '/region/:key', element: <p>{STUDY}</p> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  render(
    <ProgressProvider store={store}>
      <RouterProvider router={router} />
    </ProgressProvider>,
  )
}

describe('first visit', () => {
  it('shows the notice before any study content the first time, and not on later visits', async () => {
    const user = userEvent.setup()
    const store = createMemoryStore<Progress>()

    openApp(store, '/region/face')

    expect(screen.queryByText(STUDY)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^Cuidado/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText(STUDY)).toBeInTheDocument()

    cleanup()
    openApp(store, '/region/face')

    expect(screen.getByText(STUDY)).toBeInTheDocument()
  })
})
