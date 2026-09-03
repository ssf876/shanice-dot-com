import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import App from './App.jsx'
import { profile } from './content/profile.js'

const renderApp = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )

describe('App smoke test', () => {
  it('renders the site hero with no Firebase env configuration present', () => {
    // No .env exists in CI (or by default locally) — the site must render anyway.
    expect(import.meta.env.VITE_FIREBASE_API_KEY).toBeUndefined()

    renderApp()

    expect(
      screen.getByRole('heading', { level: 1, name: profile.name }),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations on the base render', async () => {
    const { container } = renderApp()
    expect(await axe(container)).toHaveNoViolations()
  })
})
