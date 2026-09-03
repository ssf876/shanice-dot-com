import { describe, expect, it } from 'vitest'
import { profile } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { posts } from '../lib/posts.js'
import { validatePost, validateProfile, validateProject } from '../lib/validate.js'

// Contract (spec: "Content slots" acceptance): the validation test enumerates the
// required fields in profile, projects, and post frontmatter and fails when one is
// missing or empty — placeholder text passes by design. The "catches" cases below
// mutate the REAL shipped content so a future shape change keeps them honest.

const reports = (errors, field) =>
  errors.some((message) => message.includes(field))

describe('profile content contract', () => {
  it('passes with placeholder content', () => {
    expect(validateProfile(profile)).toEqual([])
  })

  it('catches a deleted required field', () => {
    const withoutTitle = { ...profile }
    delete withoutTitle.title
    const errors = validateProfile(withoutTitle)
    expect(errors.length).toBeGreaterThan(0)
    expect(reports(errors, 'profile.title')).toBe(true)
  })

  it('catches an emptied required field', () => {
    const errors = validateProfile({ ...profile, name: '   ' })
    expect(reports(errors, 'profile.name')).toBe(true)
  })

  it('catches a malformed email', () => {
    const errors = validateProfile({ ...profile, email: 'not-an-email' })
    expect(reports(errors, 'profile.email')).toBe(true)
  })
})

describe('projects content contract', () => {
  it('passes with placeholder content', () => {
    for (const [index, project] of projects.entries()) {
      expect(validateProject(project, index)).toEqual([])
    }
  })

  it('catches a deleted required field', () => {
    const withoutTagline = { ...projects[0] }
    delete withoutTagline.tagline
    const errors = validateProject(withoutTagline)
    expect(errors.length).toBeGreaterThan(0)
    expect(reports(errors, 'tagline')).toBe(true)
  })

  it('catches an emptied tech list', () => {
    const errors = validateProject({ ...projects[0], tech: [] })
    expect(reports(errors, 'tech')).toBe(true)
  })

  it('allows an empty url but rejects a non-URL value', () => {
    expect(validateProject({ ...projects[0], url: '' })).toEqual([])
    const errors = validateProject({ ...projects[0], url: 'not-a-url' })
    expect(reports(errors, 'url')).toBe(true)
  })
})

describe('post frontmatter contract', () => {
  it('passes for every committed post (placeholders included)', () => {
    expect(posts.length).toBeGreaterThanOrEqual(2)
    for (const post of posts) {
      expect(validatePost(post)).toEqual([])
    }
  })

  it('catches a deleted required frontmatter field', () => {
    const withoutDate = { ...posts[0] }
    delete withoutDate.date
    const errors = validatePost(withoutDate)
    expect(errors.length).toBeGreaterThan(0)
    expect(reports(errors, 'post.date')).toBe(true)
  })

  it('catches an unparseable date', () => {
    const errors = validatePost({ ...posts[0], date: 'not-a-date' })
    expect(reports(errors, 'post.date')).toBe(true)
  })

  it('catches an emptied tags list', () => {
    const errors = validatePost({ ...posts[0], tags: [] })
    expect(reports(errors, 'post.tags')).toBe(true)
  })
})
