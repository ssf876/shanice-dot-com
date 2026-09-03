import { profile } from '../content/profile.js'
import { projects } from '../content/projects.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { homeTitle } from '../lib/titles.js'

// Stub — the real hero, featured grid, and latest posts arrive in the pages PR.
export default function Home() {
  usePageTitle(homeTitle())
  const featured = projects.filter((project) => project.highlight)
  return (
    <section>
      <h1 className="page-title">{profile.name}</h1>
      <p className="page-subtitle">{profile.title}</p>
      <h2>Featured projects</h2>
      <ul>
        {featured.map((project) => (
          <li key={project.title}>
            {project.title} — {project.tagline}
          </li>
        ))}
      </ul>
      <p className="stub-note">Placeholder home — the full page ships in the next PR.</p>
    </section>
  )
}
