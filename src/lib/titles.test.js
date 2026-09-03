import { describe, expect, it } from 'vitest'
import { homeTitle, sectionTitle } from './titles.js'
import { profile } from '../content/profile.js'

describe('page titles', () => {
  it('composes the home title from the content model', () => {
    expect(homeTitle()).toBe(`${profile.name} · ${profile.title}`)
  })

  it('suffixes the site name for section pages', () => {
    expect(sectionTitle('About')).toBe(`About · ${profile.name}`)
  })
})
