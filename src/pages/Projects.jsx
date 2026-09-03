import { projects } from '../content/projects.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Stub — the card grid with tech chips and links arrives in the pages PR.
export default function Projects() {
  usePageTitle(sectionTitle('Projects'))
  return (
    <section>
      <h1 className="page-title">Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.title}>
            {project.title} — {project.tagline} ({project.tech.join(', ')})
          </li>
        ))}
      </ul>
      <p className="stub-note">Placeholder list — the full project grid ships in the next PR.</p>
    </section>
  )
}
