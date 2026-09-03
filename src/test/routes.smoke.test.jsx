import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import App from '../App.jsx'
import { profile } from '../content/profile.js'
import { posts } from '../lib/posts.js'

const renderRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

// Route → its level-1 heading and expected document.title. Post and title
// expectations derive from the content model, so a paste-in keeps tests honest.
const newestPost = posts[0]
const ROUTES = [
  { path: '/', heading: profile.name, title: `${profile.name} · ${profile.title}` },
  { path: '/about', heading: 'About', title: `About · ${profile.name}` },
  { path: '/projects', heading: 'Projects', title: `Projects · ${profile.name}` },
  { path: '/writing', heading: 'Writing', title: `Writing · ${profile.name}` },
  {
    path: `/writing/${newestPost.slug}`,
    heading: newestPost.title,
    title: `${newestPost.title} · ${profile.name}`,
  },
  { path: '/contact', heading: 'Contact', title: `Contact · ${profile.name}` },
  { path: '/no-such-page', heading: 'Page not found', title: `Page not found · ${profile.name}` },
]

describe('route smoke', () => {
  it('renders the shell with no Firebase env configuration present', () => {
    // No .env exists in CI (or by default locally) — the site must render anyway.
    expect(import.meta.env.VITE_FIREBASE_API_KEY).toBeUndefined()

    renderRoute('/')

    expect(
      screen.getByRole('heading', { level: 1, name: profile.name }),
    ).toBeInTheDocument()
  })

  it.each(ROUTES)('renders $path with document.title "$title"', ({ path, heading, title }) => {
    renderRoute(path)

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(document.title).toBe(title)
  })

  it('renders the main landmark, primary nav, and footer socials from the content model', () => {
    renderRoute('/')

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()

    const footer = screen.getByRole('contentinfo')
    for (const social of profile.socials) {
      expect(
        within(footer).getByRole('link', { name: social.label }),
      ).toHaveAttribute('href', social.url)
    }
  })

  it('reaches all five sections through the header nav', () => {
    renderRoute('/')
    const nav = screen.getByRole('navigation', { name: 'Primary' })

    for (const [label, heading] of [
      ['About', 'About'],
      ['Projects', 'Projects'],
      ['Writing', 'Writing'],
      ['Contact', 'Contact'],
      ['Home', profile.name],
    ]) {
      fireEvent.click(within(nav).getByRole('link', { name: label }))
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    }
  })

  it('navigates from the writing index into a post and back out', () => {
    renderRoute('/writing')

    fireEvent.click(screen.getByRole('link', { name: new RegExp(newestPost.title) }))
    expect(
      screen.getByRole('heading', { level: 1, name: newestPost.title }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /Back to all writing/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument()
  })

  it('offers a way back from an unknown slug and an unknown URL', () => {
    renderRoute('/writing/no-such-post')
    fireEvent.click(screen.getByRole('link', { name: /Back to all writing/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument()

    renderRoute('/definitely/not/here')
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toBeInTheDocument()
  })

  it.each(ROUTES)('has no accessibility violations on $path', async ({ path }) => {
    const { container } = renderRoute(path)

    expect(await axe(container)).toHaveNoViolations()
  })
})
