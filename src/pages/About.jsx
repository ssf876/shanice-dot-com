import { profile } from '../content/profile.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Stub — the experience timeline joins the bio when the page bodies land.
export default function About() {
  usePageTitle(sectionTitle('About'))
  return (
    <section>
      <h1 className="page-title">About</h1>
      {profile.bio.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p className="stub-note">Experience timeline ships with the full page in the next PR.</p>
    </section>
  )
}
