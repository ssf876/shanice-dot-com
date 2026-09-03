import { profile } from '../content/profile.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Spec ("Contact — Ask me anything"): client-side only — the AMA prompts, a
// pre-subjected mailto CTA, and social links. No form, no storage, no
// backend; the subject line arrives prefilled so the email just needs typing.
const AMA_SUBJECT = 'Ask me anything'

export default function Contact() {
  usePageTitle(sectionTitle('Contact'))

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(AMA_SUBJECT)}`

  return (
    <section>
      <h1 className="page-title">Contact</h1>
      <p className="page-subtitle">Have a question? Ask me anything.</p>

      <h2 className="section-heading">Ask me about</h2>
      {profile.ama.length === 0 ? (
        <p className="empty-note">No prompts yet — but the inbox is open.</p>
      ) : (
        <ul className="ama-list">
          {profile.ama.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      )}

      <p className="contact-cta">
        <a className="button" href={mailtoHref}>
          Email {profile.name}
        </a>
      </p>

      <h2 className="section-heading">Elsewhere</h2>
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
