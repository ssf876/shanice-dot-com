import { projects } from '../content/projects.js'
import { elsewhere } from '../content/elsewhere.js'
import ProjectCard from '../components/ProjectCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

export default function Projects() {
  usePageTitle(sectionTitle('Projects'))

  return (
    <section>
      <h1 className="page-title">Projects</h1>
      {projects.length === 0 ? (
        <p className="empty-note">No projects listed yet — check back soon.</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}
      <section className="home-section" aria-labelledby="elsewhere-heading">
        <h2 id="elsewhere-heading">Elsewhere</h2>
        {elsewhere.map((item) => (
          <div key={item.label} className="elsewhere-entry">
            <h3><a href={item.url}>{item.label}</a></h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </section>
    </section>
  )
}
