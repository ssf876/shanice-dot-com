import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { timeline } from '../content/timeline.js'

const routes = ['/', '/about', '/projects', '/writing', '/contact']

describe('public V1 content', () => {
  it.each(routes)('has no sample content or published inbox on %s', (path) => {
    const { container } = render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    expect(screen.getByRole('main').textContent).not.toMatch(/paste|placeholder|e\.g\.|hello, world|from spreadsheets to code/i)
    expect(container.innerHTML).not.toMatch(/mailto:|@gmail\.com/)
  })

  it('contains only the five V1 entries in oldest-first DOM order', () => {
    expect(timeline.map(({ id }) => id)).toEqual([
      'howard', 'bnp-analyst', 'columbia', 'paypal-analyst', 'paypal-engineer',
    ])
    render(<MemoryRouter initialEntries={['/about']}><App /></MemoryRouter>)
    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(screen.queryByText(/Internship|Summer Analyst/)).not.toBeInTheDocument()
    for (const item of timeline) expect(['Work', 'Education']).toContain(item.category)
  })
})
