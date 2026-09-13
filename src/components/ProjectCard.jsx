// Editorial project entry; verified links are optional.
export default function ProjectCard({ project, headingLevel = 2 }) {
  const HeadingTag = headingLevel === 2 ? 'h2' : 'h3'
  const hasLinks = Boolean(project.url || project.repo)

  return (
    <article className="project-entry">
      <HeadingTag className="card-title">{project.title}</HeadingTag>
      <p className="card-tagline">{project.tagline}</p>
      {project.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <ul className="work-tech" aria-label={`Technologies used in ${project.title}`}>
        {project.tech.map((item) => (
          <li key={item}>
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
