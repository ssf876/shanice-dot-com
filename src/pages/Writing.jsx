import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collectTags, filterPostsByTag, formatPostDate, posts } from '../lib/posts.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sectionTitle } from '../lib/titles.js'

// Spec route table for /writing: post list, newest first (the pipeline's sort
// order), tag-filterable. Filtering is client-side toggle state over the
// already-sorted list — `posts` order is never mutated.
export default function Writing() {
  usePageTitle(sectionTitle('Writing'))

  const [activeTag, setActiveTag] = useState(null)
  const tags = collectTags(posts)
  const visiblePosts = activeTag ? filterPostsByTag(posts, activeTag) : posts

  return (
    <section>
      <h1 className="page-title">Writing</h1>

      {tags.length > 0 && (
        <div role="group" aria-label="Filter posts by tag" className="tag-filter">
          <button
            type="button"
            className="tag-button"
            aria-pressed={activeTag === null}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-button"
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visiblePosts.length === 0 ? (
        <p className="empty-note">No posts tagged “{activeTag}” yet.</p>
      ) : (
        <ul className="post-list">
          {visiblePosts.map((post) => (
            <li key={post.slug} className="post-list-item">
              <article>
                <h2 className="post-list-title">
                  <Link to={`/writing/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="post-meta">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </p>
                <p className="post-description">{post.description}</p>
                <ul className="tag-list" aria-label={`Tags for ${post.title}`}>
                  {post.tags.map((tag) => (
                    <li key={tag} className="tag-chip">
                      #{tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
