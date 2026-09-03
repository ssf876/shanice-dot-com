import { Link, useParams } from 'react-router-dom'
import { formatPostDate, posts } from '../lib/posts.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Spec route table for /writing/:slug: rendered markdown with title/date.
// A wrong slug gets a real recovery path instead of a white screen — the
// not-found state links back to the full post list.
export default function WritingPost() {
  const { slug } = useParams()
  const post = posts.find((candidate) => candidate.slug === slug)

  usePageTitle(post ? sectionTitle(post.title) : sectionTitle('Post not found'))

  if (!post) {
    return (
      <section>
        <h1 className="page-title">Post not found</h1>
        <p>
          No post lives at <code>/writing/{slug}</code>.
        </p>
        <p>
          <Link to="/writing">Back to all writing</Link>
        </p>
      </section>
    )
  }

  return (
    <article>
      <h1 className="page-title">{post.title}</h1>
      <p className="post-meta">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>
      {/* Build-time markdown→HTML from the trusted repo pipeline (spec). */}
      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      <p>
        <Link to="/writing">Back to all writing</Link>
      </p>
    </article>
  )
}
