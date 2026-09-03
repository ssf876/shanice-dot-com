// Build-time markdown pipeline (spec: "Writing pipeline"). import.meta.glob is
// resolved by Vite/Vitest, so posts are ordinary modules — no runtime fetching,
// and the deployed site stays fully static. Publishing a post = commit markdown
// + redeploy.
//
// Parser choice: front-matter over gray-matter — this pipeline needs YAML
// frontmatter only, and front-matter does that with a smaller dependency
// surface (gray-matter pulls js-yaml and CJS interop for APIs we don't use).
import { marked } from 'marked'
import fm from 'front-matter'

const files = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Pure so tests can run it over fixtures — including the malformed-frontmatter
// fixture, which throws here at suite time so it fails CI, never a visitor's browser.
export function parsePost(path, raw) {
  const { attributes, body } = fm(raw)
  const slug = path.split('/').pop().replace(/\.md$/, '')
  return { slug, ...attributes, html: marked.parse(body) }
}

export const posts = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
