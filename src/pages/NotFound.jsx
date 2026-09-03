import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// The Hosting SPA rewrite sends every unknown path here; keep a real way home.
export default function NotFound() {
  usePageTitle(sectionTitle('Page not found'))
  return (
    <section>
      <h1 className="page-title">Page not found</h1>
      <p>That URL doesn&apos;t match anything on this site.</p>
      <p>
        <Link to="/">Back to the home page</Link>
      </p>
    </section>
  )
}
