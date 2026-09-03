import { Link } from 'react-router-dom'
import { posts } from '../lib/posts.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Stub — tag filtering and richer post cards arrive in the pages PR.
export default function Writing() {
  usePageTitle(sectionTitle('Writing'))
  return (
    <section>
      <h1 className="page-title">Writing</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/writing/${post.slug}`}>{post.title}</Link>{' '}
            <time dateTime={post.date}>{post.date}</time>
          </li>
        ))}
      </ul>
      <p className="stub-note">Placeholder index — tag filtering ships in the next PR.</p>
    </section>
  )
}
