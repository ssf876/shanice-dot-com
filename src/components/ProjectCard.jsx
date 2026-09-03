// One project card, shared by the Home featured grid and the Projects page.
// url and repo are optional in the content contract — the link affordances
// disappear entirely (never render disabled) when a project has neither.
// headingLevel keeps the outline sequential: h2 on the Projects page (under
// its h1), h3 inside Home's featured section (under the section's h2).

export default function ProjectCard({ project, headingLevel = 2 }) {
  const HeadingTag = headingLevel === 2 ? 'h2' : 'h3'
  const hasLinks = Boolean(project.url || project.repo)

  return (
    <article className="card">
      <HeadingTag className="card-title">{project.title}</HeadingTag>
      <p className="card-tagline">{project.tagline}</p>
      <ul className="tech-list" aria-label={`Technologies used in ${project.title}`}>
        {project.tech.map((item) => (
          <li key={item} className="tech-chip">
            {item}
          </li>
        ))}
      </ul>
      {hasLinks && (
        <p className="card-links">
          {project.url && (
            <a href={project.url}>
              Live demo<span className="visually-hidden"> of {project.title}</span>
            </a>
          )}
          {project.repo && (
            <a href={project.repo}>
              Code<span className="visually-hidden"> for {project.title}</span>
            </a>
          )}
        </p>
      )}
    </article>
  )
}
