import { describe, expect, it } from 'vitest'
import { collectTags, filterPostsByTag, formatPostDate, parsePost, posts } from './posts.js'
import malformedFrontmatter from '../test/fixtures/malformed-frontmatter.md?raw'

describe('markdown pipeline', () => {
  it('derives the slug from the filename', () => {
    for (const post of posts) {
      expect(post.slug).not.toMatch(/\.md$/)
      expect(post.slug).not.toContain('/')
    }
    expect(posts.map((post) => post.slug)).toEqual([
      'hello-world',
      'from-spreadsheets-to-code',
    ])
  })

  it('lists fixture posts in date order, newest first', () => {
    const dates = posts.map((post) => new Date(post.date).getTime())
    expect(dates).toEqual([...dates].sort((a, b) => b - a))
  })

  it('renders the markdown body to HTML', () => {
    for (const post of posts) {
      expect(post.html).toContain('<p>')
    }
    // Inline and list markup survive the marked render.
    const hello = posts.find((post) => post.slug === 'hello-world')
    expect(hello.html).toContain('<strong>placeholder post</strong>')
    expect(hello.html).toContain('<li>')
  })

  it("fails the suite — not the visitor's browser — on malformed frontmatter", () => {
    // The fixture lives outside src/content/posts/ so the app glob never sees it.
    // If malformed frontmatter WERE committed there, parsePost would throw while
    // the module loads, failing CI before anything ships.
    expect(() =>
      parsePost('malformed-frontmatter.md', malformedFrontmatter),
    ).toThrow()
  })
})

describe('tag helpers', () => {
  it('collects the tags in use, alphabetized and unique', () => {
    expect(collectTags([{ tags: ['b', 'a'] }, { tags: ['a', 'c'] }, {}])).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('filters to posts carrying the tag, preserving list order', () => {
    const list = [
      { slug: 'newer', tags: ['x'] },
      { slug: 'older', tags: ['y'] },
    ]
    expect(filterPostsByTag(list, 'x')).toEqual([{ slug: 'newer', tags: ['x'] }])
    expect(filterPostsByTag(list, 'nope')).toEqual([])
  })
})

describe('formatPostDate', () => {
  it('formats an ISO frontmatter date, pinned to UTC', () => {
    expect(formatPostDate('2026-09-01')).toBe('September 1, 2026')
  })

  it('accepts the Date instance front-matter can yield for unquoted YAML', () => {
    expect(formatPostDate(new Date('2026-08-15T00:00:00Z'))).toBe('August 15, 2026')
  })
})
