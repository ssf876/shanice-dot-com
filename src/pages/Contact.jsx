import './Contact.css'
import { useState } from 'react'
import { profile } from '../content/profile.js'
import { contact } from '../content/contact.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

export default function Contact() {
  usePageTitle(sectionTitle('Contact'))
  const [status, setStatus] = useState('idle')

  async function submitMessage(event) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const body = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) throw new Error('Delivery failed')
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section>
      <h1 className="page-title">{contact.heading}</h1>
      {contact.body.map((paragraph) => <p className="bio-paragraph" key={paragraph}>{paragraph}</p>)}
      <form className="contact-form" onSubmit={submitMessage} aria-label="Send a message">
        <label htmlFor="contact-name">{contact.form.name}</label>
        <input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
        <label htmlFor="contact-email">{contact.form.email}</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        <label htmlFor="contact-message">{contact.form.message}</label>
        <textarea id="contact-message" name="message" rows={7} maxLength={5000} required />
        <div hidden><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <button className="button" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? contact.form.sending : contact.form.submit}
        </button>
        <p role="status" aria-live="polite">{status === 'success' || status === 'error' ? contact.form[status] : ''}</p>
      </form>
      <h2 className="section-heading">Ask me about</h2>
      <ul className="ama-list">{profile.ama.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
      <h2 className="section-heading">Elsewhere</h2>
      <ul className="social-links">
        {profile.socials.map((social) => <li key={social.url}><a href={social.url}>{social.label}</a></li>)}
      </ul>
    </section>
  )
}
