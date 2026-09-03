import { describe, expect, it } from 'vitest'
import { parsePost, posts } from './posts.js'
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
