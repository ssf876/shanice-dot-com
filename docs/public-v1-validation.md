# Public V1 implementation and validation

Branch: `content/web-ready-v1`. Local commits only; no push or deployment.

## Routes and content

- `/`: approved headline, supporting paragraph, interests, and three selected projects.
- `/about`: eight approved bio paragraphs and a semantic work/education timeline.
- `/projects`: three approved project descriptions, technologies, repository links, and Elsewhere.
- `/writing`: heading only; removed from primary navigation and homepage while no genuine posts exist.
- `/writing/hello-world` and `/writing/from-spreadsheets-to-code`: normal post-not-found state.
- `/contact`: approved copy, Ask me about prompts, social links, and private message form.
- `/api/contact`: server-only email delivery handler.
- Homepage title and HTML description updated to the approved identity.

Both sample posts were moved to `src/test/fixtures`; they are no longer included
by the production Markdown loader. Placeholder bio/experience text and the
public email address were removed. No supplied project repository links are
omitted: Sika and Recipes use the URLs supplied in the follow-up. No live-demo
URLs were invented.

The timeline uses the approved tile title “Data Analyst” consistently. The
request's mobile example separately said “Data Analyst II”; this implementation
does not change the title by viewport. Detailed experience bullets were absent
from the current content model and the local About branch, so none were invented.

## Completed validation

On Node.js 20.20.2:

- `npm run lint`: passed.
- `npm test`: 83 tests passed across 8 files.
- `npm run build`: passed.
- `git diff --check`: passed.
- Route/navigation and jest-axe accessibility tests passed.
- Public route tests reject visible placeholder/sample text and public inbox links.
- Timeline tests verify descending DOM chronology and milestone/range endpoints.
- Contact tests cover accepted delivery, missing configuration, invalid payloads,
  unsupported requests, provider errors, retry, and preserving unsent messages.
- Calculated timeline text contrast: minimum 4.68:1, with the remaining tile
  combinations ranging from 7.31:1 to 14.41:1. The markets tile uses a blend of
  existing orange tokens because pure burnt orange with espresso was 4.31:1.

## Outstanding validation and configuration

- Manual desktop, tablet, and narrow mobile inspection could not run: no browser
  was connected and Safari reported Computer Use permissions were not granted.
  Overflow, visual connector alignment, and rendered tile overlap therefore still
  require browser review. Responsive CSS switches to one column at 60rem.
- Inbox delivery has not been exercised. Configure the private Resend variables
  described in [contact-delivery.md](contact-delivery.md), then test on a Vercel
  preview. Local Vite does not execute Vercel functions. Missing configuration
  returns a failure response; it never reports a false successful send.
- The GitHub profile and site repository were reachable through the web checker.
  LinkedIn and Tableau checks returned tool errors; their supplied URLs were
  preserved. Sika/Recipes URLs were supplied directly by the user.
- Detailed approved experience bullets are still needed if a supporting detail
  section is desired. Only supplied facts appear in the current timeline.

## Files changed

- `.env.example`
- `api/contact.js`
- `docs/contact-delivery.md`
- `docs/public-v1-validation.md`
- `index.html`
- `src/components/ExperienceTimeline.css`
- `src/components/ExperienceTimeline.jsx`
- `src/components/Layout.jsx`
- `src/components/ProjectCard.jsx`
- `src/content/contact.js`
- `src/content/elsewhere.js`
- `src/content/home.js`
- `src/content/profile.js`
- `src/content/projects.js`
- `src/content/timeline.js`
- `src/index.css`
- `src/lib/posts.test.js`
- `src/lib/titles.js`
- `src/lib/titles.test.js`
- `src/lib/validate.js`
- `src/pages/About.jsx`
- `src/pages/Contact.css`
- `src/pages/Contact.jsx`
- `src/pages/Home.jsx`
- `src/pages/Projects.jsx`
- `src/pages/Writing.jsx`
- `src/styles/tokens.css`
- `src/test/contact-api.test.js`
- `src/test/contact.test.jsx`
- `src/test/content-validation.test.js`
- `src/test/fixtures/from-spreadsheets-to-code.md`
- `src/test/fixtures/hello-world.md`
- `src/test/pages.test.jsx`
- `src/test/public-content.test.jsx`
- `src/test/routes.smoke.test.jsx`
- `vercel.json`
