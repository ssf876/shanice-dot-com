import ExperienceTimeline from '../components/ExperienceTimeline.jsx'
import { profile } from '../content/profile.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

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

      <ExperienceTimeline />
    </section>
  )
}
