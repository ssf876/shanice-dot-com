import { Link } from 'react-router-dom'
import { profile } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { formatPostDate, posts } from '../lib/posts.js'
import ProjectCard from '../components/ProjectCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { homeTitle } from '../lib/titles.js'

// Spec route table for /: hero (name, title, one-liner, primary CTA),
// featured projects (max 3, via the highlight flag), latest 3 posts. Every
// string renders from the content model — nothing page-specific is hardcoded.
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
        <h1 id="hero-heading" className="page-title">
          {profile.name}
        </h1>
        <p className="page-subtitle">{profile.title}</p>
        {profile.bio[0] && <p className="hero-lede">{profile.bio[0]}</p>}
        <p className="hero-cta">
          <Link className="button" to="/contact">
            Ask me anything
          </Link>
        </p>
      </section>

      <section className="home-section" aria-labelledby="featured-projects-heading">
        <h2 id="featured-projects-heading">Featured projects</h2>
        {featured.length === 0 ? (
          <p className="empty-note">No featured projects yet — check back soon.</p>
        ) : (
          <div className="card-grid">
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} headingLevel={3} />
            ))}
          </div>
        )}
        <p className="section-more">
          <Link to="/projects">All projects</Link>
        </p>
      </section>

      <section className="home-section" aria-labelledby="latest-writing-heading">
        <h2 id="latest-writing-heading">Latest writing</h2>
        {latestPosts.length === 0 ? (
          <p className="empty-note">No posts yet — check back soon.</p>
        ) : (
          <ul className="post-list">
            {latestPosts.map((post) => (
              <li key={post.slug} className="post-list-item">
                <h3 className="post-list-title">
                  <Link to={`/writing/${post.slug}`}>{post.title}</Link>
                </h3>
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
      </section>
    </>
  )
}
