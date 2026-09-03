import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { axe } from 'jest-axe'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Projects from '../pages/Projects.jsx'
import Writing from '../pages/Writing.jsx'
import WritingPost from '../pages/WritingPost.jsx'
import Contact from '../pages/Contact.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { profile } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { posts } from '../lib/posts.js'

// Pages render inside a router (Links) but without the shell — the smoke suite
// already covers nav/footer. Every expectation derives from the content model,
// so a paste-in keeps these tests honest instead of breaking them.
const renderPage = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

const renderPostRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/writing/:slug" element={<WritingPost />} />
      </Routes>
    </MemoryRouter>,
  )

const newestFirst = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

describe('Home', () => {
  it('renders the hero from the profile with a primary CTA to /contact', () => {
    renderPage(<Home />)

    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
    expect(screen.getByText(profile.title)).toBeInTheDocument()
    // One-liner: the first bio paragraph leads the page.
    expect(screen.getByText(profile.bio[0])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ask me anything' })).toHaveAttribute(
      'href',
      '/contact',
    )
  })

  it('features highlighted projects (capped at 3) as cards', () => {
    renderPage(<Home />)

    const featuredSection = screen.getByRole('region', { name: 'Featured projects' })
    const featured = projects.filter((project) => project.highlight).slice(0, 3)

    for (const project of featured) {
      expect(
        within(featuredSection).getByRole('heading', { level: 3, name: project.title }),
      ).toBeInTheDocument()
    }
    const cardTitles = within(featuredSection).getAllByRole('heading', { level: 3 })
    expect(cardTitles).toHaveLength(featured.length)
    expect(
      within(featuredSection).getByRole('link', { name: 'All projects' }),
    ).toHaveAttribute('href', '/projects')
  })

  it('lists the latest posts (capped at 3) with links into the post pages', () => {
    renderPage(<Home />)

    const latestSection = screen.getByRole('region', { name: 'Latest writing' })
    const latest = posts.slice(0, 3)

    for (const post of latest) {
      expect(
        within(latestSection).getByRole('link', { name: post.title }),
      ).toHaveAttribute('href', `/writing/${post.slug}`)
    }
    const postLinks = within(latestSection)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/writing/'))
    expect(postLinks).toHaveLength(Math.min(3, posts.length))
    expect(within(latestSection).getByRole('link', { name: 'All writing' })).toHaveAttribute(
      'href',
      '/writing',
    )
  })
})

describe('About', () => {
  it('renders every bio paragraph', () => {
    renderPage(<About />)

    for (const paragraph of profile.bio) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('renders the experience timeline from the content model', () => {
    renderPage(<About />)

    for (const job of profile.experience) {
      expect(screen.getByRole('heading', { level: 3, name: job.role })).toBeInTheDocument()
      expect(screen.getByText(job.company, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(job.period, { exact: false })).toBeInTheDocument()
      for (const highlight of job.highlights) {
        expect(screen.getByText(highlight)).toBeInTheDocument()
      }
    }
  })
})

describe('Projects', () => {
  it('renders a card per project with title, tagline, and tech', () => {
    renderPage(<Projects />)

    for (const project of projects) {
      const card = screen
        .getByRole('heading', { level: 2, name: project.title })
        .closest('article')
      expect(within(card).getByText(project.tagline)).toBeInTheDocument()
      for (const tech of project.tech) {
        expect(within(card).getByText(tech)).toBeInTheDocument()
      }
    }
  })

  it('shows link affordances only for the url/repo values a project actually has', () => {
    renderPage(<Projects />)

    for (const project of projects) {
      const card = screen
        .getByRole('heading', { level: 2, name: project.title })
        .closest('article')

      if (project.url) {
        expect(within(card).getByRole('link', { name: /Live demo/ })).toHaveAttribute(
          'href',
          project.url,
        )
      } else {
        expect(within(card).queryByRole('link', { name: /Live demo/ })).not.toBeInTheDocument()
      }

      if (project.repo) {
        expect(within(card).getByRole('link', { name: /Code/ })).toHaveAttribute(
          'href',
          project.repo,
        )
      } else {
        expect(within(card).queryByRole('link', { name: /Code/ })).not.toBeInTheDocument()
      }
    }
  })
})

describe('ProjectCard link affordances', () => {
  const base = { title: 'Linked', tagline: 'A linked project', tech: ['React'] }

  it('renders live/code links when a project has them', () => {
    renderPage(
      <ProjectCard
        project={{ ...base, url: 'https://example.com', repo: 'https://github.com/example/linked' }}
      />,
    )

    expect(screen.getByRole('link', { name: /Live demo/ })).toHaveAttribute(
      'href',
      'https://example.com',
    )
    expect(screen.getByRole('link', { name: /Code/ })).toHaveAttribute(
      'href',
      'https://github.com/example/linked',
    )
  })

  it('omits the link row entirely when url and repo are empty', () => {
    renderPage(<ProjectCard project={{ ...base, url: '', repo: '' }} />)

    expect(screen.queryByRole('link', { name: /Live demo/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Code/ })).not.toBeInTheDocument()
  })
})

describe('Writing', () => {
  it('lists posts newest first with description and tags', () => {
    renderPage(<Writing />)

    const renderedTitles = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    expect(renderedTitles).toEqual(newestFirst.map((post) => post.title))

    for (const post of posts) {
      expect(screen.getByText(post.description)).toBeInTheDocument()
      const card = screen
        .getByRole('heading', { level: 2, name: post.title })
        .closest('article')
      for (const tag of post.tags) {
        expect(within(card).getByText(`#${tag}`)).toBeInTheDocument()
      }
    }
  })

  it('filters by tag on click and toggles back off', () => {
    renderPage(<Writing />)

    const tag = newestFirst[0].tags[0]
    const tagButton = screen.getByRole('button', { name: tag })

    fireEvent.click(tagButton)
    expect(tagButton).toHaveAttribute('aria-pressed', 'true')
    const visibleTitles = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    expect(visibleTitles).toEqual(
      newestFirst.filter((post) => post.tags.includes(tag)).map((post) => post.title),
    )

    fireEvent.click(tagButton)
    expect(tagButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(posts.length)
  })

  it('the All button resets the filter', () => {
    renderPage(<Writing />)

    fireEvent.click(screen.getByRole('button', { name: newestFirst[0].tags[0] }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(posts.length)
  })
})

describe('WritingPost', () => {
  it('renders the markdown body with title and date for a known slug', () => {
    const post = posts[0]
    const { container } = renderPostRoute(`/writing/${post.slug}`)

    expect(screen.getByRole('heading', { level: 1, name: post.title })).toBeInTheDocument()
    expect(container.querySelector('time')).toHaveAttribute('dateTime', post.date)
    // The rendered body is exactly the pipeline's build-time HTML.
    expect(container.querySelector('.post-body').innerHTML).toBe(post.html)
  })

  it('renders a not-found state with a recovery path for an unknown slug', () => {
    renderPostRoute('/writing/definitely-not-a-post')

    expect(screen.getByRole('heading', { level: 1, name: 'Post not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to all writing' })).toBeInTheDocument()
  })
})

describe('Contact', () => {
  it('renders the AMA prompts from the profile', () => {
    renderPage(<Contact />)

    for (const prompt of profile.ama) {
      expect(screen.getByText(prompt)).toBeInTheDocument()
    }
  })

  it('pre-subjects the mailto CTA and links the socials', () => {
    renderPage(<Contact />)

    const expectedHref = `mailto:${profile.email}?subject=${encodeURIComponent('Ask me anything')}`
    expect(screen.getByRole('link', { name: `Email ${profile.name}` })).toHaveAttribute(
      'href',
      expectedHref,
    )
    for (const social of profile.socials) {
      expect(screen.getByRole('link', { name: social.label })).toHaveAttribute(
        'href',
        social.url,
      )
    }
  })
})

describe('page accessibility', () => {
  const pages = [
    ['home', <Home />],
    ['about', <About />],
    ['projects', <Projects />],
    ['writing', <Writing />],
    ['contact', <Contact />],
  ]

  it.each(pages)('%s renders with zero accessibility violations', async ([, page]) => {
    const { container } = renderPage(page)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('the post page and its not-found state render with zero violations', async () => {
    const known = renderPostRoute(`/writing/${posts[0].slug}`)
    expect(await axe(known.container)).toHaveNoViolations()
    known.unmount()

    const unknown = renderPostRoute('/writing/definitely-not-a-post')
    expect(await axe(unknown.container)).toHaveNoViolations()
  })

  it('the tag-filtered writing state renders with zero violations', async () => {
    const { container } = renderPage(<Writing />)
    fireEvent.click(screen.getByRole('button', { name: newestFirst[0].tags[0] }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
