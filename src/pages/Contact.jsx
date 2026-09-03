import { profile } from '../content/profile.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Client-side only per the spec: AMA prompts, mailto CTA, social links.
export default function Contact() {
  usePageTitle(sectionTitle('Contact'))
  return (
    <section>
      <h1 className="page-title">Contact</h1>
      <ul>
        {profile.ama.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      <p>
        <a className="button" href={`mailto:${profile.email}`}>
          Email {profile.name}
        </a>
      </p>
      <ul className="social-links">
        {profile.socials.map((social) => (
          <li key={social.url}>
            <a href={social.url}>{social.label}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
