import { Link } from 'react-router-dom'
import { projects } from '../content/projects.js'
import { formatPostDate, posts } from '../lib/posts.js'
import { home } from '../content/home.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { homeTitle } from '../lib/titles.js'

const FEATURED_LIMIT = 3
const LATEST_POSTS_LIMIT = 3

export default function Home() {
  usePageTitle(homeTitle())

  const featured = projects
    .filter((project) => project.highlight)
    .slice(0, FEATURED_LIMIT)
  const latestPosts = posts.slice(0, LATEST_POSTS_LIMIT)

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <h1 id="hero-heading" className="page-title hero-title">
            <span>{home.headlineStart}</span>{' '}
            <span>{home.headlineEnd} <em>{home.headlineEmphasis}</em>.</span>
          </h1>
          <p className="hero-lede">{home.supporting}</p>
          <div className="hero-cta">
            <Link className="button" to="/projects">
              View My Work <span aria-hidden="true">↗</span>
            </Link>
            {posts.length > 0 && <Link className="button button-secondary" to="/writing">Read My Writing</Link>}
            <Link className="contact-link" to="/contact">
              Contact <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <aside className="hero-sidebar" aria-labelledby="interests-heading">
          <h2 id="interests-heading" className="eyebrow">Currently interested in</h2>
          <ul>
            {home.interests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
        </aside>
      </section>

      <section className="home-section" aria-labelledby="featured-projects-heading">
        <h2 id="featured-projects-heading">Selected work</h2>
        {featured.length === 0 ? (
          <p className="empty-note">No featured projects yet — check back soon.</p>
        ) : (
          <div className="selected-work">
            {featured.map((project) => (
              <article className="work-entry" key={project.title}>
                <h3>{project.title}</h3>
                <div>
                  <p>{project.summary}</p>
                  <ul className="work-tech" aria-label={`Technologies used in ${project.title}`}>
                    {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                  {(project.url || project.repo) && (
                    <p className="card-links">
                      {project.url && <a href={project.url}>Live demo<span className="visually-hidden"> of {project.title}</span></a>}
                      {project.repo && <a href={project.repo}>Code<span className="visually-hidden"> for {project.title}</span></a>}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="section-more">
          <Link to="/projects">All projects</Link>
        </p>
      </section>

      {latestPosts.length > 0 && <section className="home-section" aria-labelledby="latest-writing-heading">
        <h2 id="latest-writing-heading">Latest writing</h2>
        {latestPosts.length === 0 ? (
          <p className="empty-note">No posts yet — check back soon.</p>
        ) : (
          <ul className="post-list home-writing">
            {latestPosts.map((post) => (
              <li key={post.slug} className="post-list-item">
                <h3 className="post-list-title">
                  <Link to={`/writing/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="post-description">{post.description}</p>
                <p className="post-meta">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="section-more">
          <Link to="/writing">All writing</Link>
        </p>
      </section>}
    </>
  )
}
