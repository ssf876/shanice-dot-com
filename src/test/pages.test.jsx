import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { axe } from 'jest-axe'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Projects from '../pages/Projects.jsx'
import Writing from '../pages/Writing.jsx'
import WritingPost from '../pages/WritingPost.jsx'
import Contact from '../pages/Contact.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { timeline } from '../content/timeline.js'
import { profile } from '../content/profile.js'
import { home } from '../content/home.js'
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


describe('Home', () => {
  it('renders the current homepage content and all three hero destinations', () => {
    renderPage(<Home />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${home.headlineStart} ${home.headlineEnd} ${home.headlineEmphasis}.`,
    )
    expect(screen.getByText(home.supporting)).toBeInTheDocument()
    for (const [name, href] of [['View My Work', '/projects'], ['Contact', '/contact']]) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
    const interests = screen.getByRole('complementary')
    expect(interests).toHaveAccessibleName()
    expect(within(interests).getAllByRole('listitem').map((item) => item.textContent))
      .toEqual(home.interests)
  })

  it('features highlighted projects (capped at 3) as editorial entries', () => {
    renderPage(<Home />)

    const featuredSection = screen.getByRole('region', { name: 'Selected work' })
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

  it('hides writing links and sample posts', () => {
    renderPage(<Home />)
    expect(screen.queryByRole('link', { name: 'Read My Writing' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Latest writing' })).not.toBeInTheDocument()
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

    const items = screen.getAllByRole('article')
    expect(items).toHaveLength(timeline.length)
    for (const [index, job] of timeline.entries()) {
      const tile = within(items[index])
      expect(tile.getByRole('heading', { level: 3, name: job.role })).toBeInTheDocument()
      expect(tile.getByText(job.company)).toBeInTheDocument()
      expect(tile.getByText(job.period, { exact: false })).toBeInTheDocument()
      expect(tile.getByText(job.category, { selector: '.experience-category' })).toBeInTheDocument()
      expect(tile.getByText(job.description)).toBeInTheDocument()
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
  it('renders only the heading when there are no genuine posts', () => {
    renderPage(<Writing />)
    expect(screen.getByRole('heading', { name: 'Writing' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(posts).toHaveLength(0)
  })
})

describe('WritingPost', () => {
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

  it('offers a message form without publishing the private inbox', () => {
    const { container } = renderPage(<Contact />)
    expect(screen.getByRole('form', { name: 'Send a message' })).toBeInTheDocument()
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
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
    const unknown = renderPostRoute('/writing/definitely-not-a-post')
    expect(await axe(unknown.container)).toHaveNoViolations()
  })

})
