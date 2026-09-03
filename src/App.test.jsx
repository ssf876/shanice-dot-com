import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import App from './App.jsx'

describe('App smoke test', () => {
  it('renders the site hero with no Firebase env configuration present', () => {
    // No .env exists in CI (or by default locally) — the site must render anyway.
    expect(import.meta.env.VITE_FIREBASE_API_KEY).toBeUndefined()

    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Shanice Sinclair' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Data Analyst' }),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations on the base render', async () => {
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
