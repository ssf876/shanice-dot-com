import { projects } from '../content/projects.js'
import ProjectCard from '../components/ProjectCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Spec route table for /projects: a card grid — title, tagline, tech, links.
// Cards hide their link affordances entirely when url and repo are empty
// (see ProjectCard), so a project with no links renders without dead UI.
export default function Projects() {
  usePageTitle(sectionTitle('Projects'))

  return (
    <section>
      <h1 className="page-title">Projects</h1>
      {projects.length === 0 ? (
        <p className="empty-note">No projects listed yet — check back soon.</p>
      ) : (
        <div className="card-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
