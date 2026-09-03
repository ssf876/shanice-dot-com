import { profile } from '../content/profile.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Spec route table for /about: bio paragraphs + experience timeline, straight
// from profile.bio and profile.experience — the paste-in slots are the page.
export default function About() {
  usePageTitle(sectionTitle('About'))

  return (
    <section>
      <h1 className="page-title">About</h1>
      {profile.bio.map((paragraph, index) => (
        <p key={index} className="bio-paragraph">
          {paragraph}
        </p>
      ))}

      <h2 className="section-heading">Experience</h2>
      <ol className="timeline">
        {profile.experience.map((job, index) => (
          <li key={index} className="timeline-item">
            <article>
              <h3 className="timeline-role">{job.role}</h3>
              <p className="timeline-meta">
                {job.company} · {job.period}
              </p>
              <ul className="timeline-highlights">
                {job.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>{highlight}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
