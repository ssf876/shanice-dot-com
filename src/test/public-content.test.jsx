import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { timeline, timelineYears } from '../content/timeline.js'

const routes = ['/', '/about', '/projects', '/writing', '/contact']

describe('public V1 content', () => {
  it.each(routes)('has no sample content or published inbox on %s', (path) => {
    const { container } = render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    expect(screen.getByRole('main').textContent).not.toMatch(/paste|placeholder|e\.g\.|hello, world|from spreadsheets to code/i)
    expect(container.innerHTML).not.toMatch(/mailto:|@gmail\.com/)
  })

  it('keeps the timeline in descending start-year order with work and education labels', () => {
    expect(timeline.map(({ period }) => Number(period.slice(0, 4)))).toEqual([2026, 2023, 2021, 2020, 2019, 2016])
    for (const item of timeline) {
      expect(['Work', 'Education']).toContain(item.category)
      const dates = item.period.split('–').map(Number)
      expect(timelineYears[item.start - 1]).toBe(Math.max(...dates))
      expect(timelineYears[item.end - 1]).toBe(Math.min(...dates))
    }
  })
})
