# Repository Guidelines

## Project Structure & Module Organization

This personal portfolio uses React, Vite, and React Router and is deployed
and hosted with Vercel.

`src/main.jsx` initializes the app; `src/App.jsx` defines routes. Page
components live in `src/pages/`, shared UI in `src/components/`, hooks in
`src/hooks/`, and utilities in `src/lib/`.

Edit portfolio data in `src/content/profile.js` and
`src/content/projects.js`. Writing posts live in `src/content/posts/`;
Markdown filenames become URL slugs.

Shared design tokens are in `src/styles/tokens.css`, with global styles in
`src/index.css`. Static assets belong in `public/`; production output goes
to generated `dist/`.

## Build, Test, and Development Commands

Use Node.js 20 to match CI.

- `npm ci`: install dependencies from the committed lockfile.
- `npm run dev`: start Vite with hot module replacement.
- `npm run lint`: run ESLint across JavaScript and JSX.
- `npm test`: run the Vitest suite once.
- `npm run build`: generate the production site in `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions

Follow existing code: two-space indentation, single-quoted JavaScript
strings, no semicolons, and ES modules.

Use PascalCase for component files, camelCase for helpers, and `use`
prefixes for hooks. Use descriptive kebab-case Markdown filenames, such as
`hello-world.md`.

Reuse design tokens and keep editable content separate from components.
ESLint enforces recommended JavaScript and React Hooks rules; no formatter
is configured.

## Testing Guidelines

Tests use Vitest, Testing Library, jsdom, and jest-axe.

Keep utility tests beside their modules as `*.test.js`; page, route, and
content validation tests belong in `src/test/`, using `*.test.jsx` for JSX.
Shared setup and fixtures also live there.

Cover changed behavior, including accessibility for UI changes. No numeric
coverage threshold is configured.

Before opening a PR, run:

- `npm run lint`
- `npm test`
- `npm run build`

CI runs all three for PRs targeting `main`.

## Git, Branch, and Pull Request Strategy

`main` is the production branch and should remain deployable.

Do not implement new work directly on `main`. Each distinct feature, fix,
content update, refactor, or other meaningful change should be developed
on its own branch and submitted through its own pull request.

Before starting new work:

1. Make sure the current branch has no unintended uncommitted changes.
2. Return to `main`.
3. Pull the latest changes from the remote.
4. Create a new branch for the work.

Use descriptive branch names with a category prefix, for example:

- `feat/update-homepage`
- `feat/add-project-page`
- `content/update-bio`
- `style/refine-color-system`
- `fix/mobile-navigation`
- `chore/vercel-migration`

Keep branches and PRs focused. Do not combine unrelated changes into the
same PR simply because they were requested during the same working session.

Do not merge changes directly into `main`. Push the feature branch and open
a pull request targeting `main`. Changes should reach `main` only after the
PR has been reviewed and intentionally merged.

Do not commit, push, merge, or delete branches unless explicitly asked.

Recent commits use concise prefixes such as `feat:`. Continue using
conventional-style prefixes where appropriate:

- `feat:` new functionality
- `fix:` bug fixes
- `content:` portfolio or writing content
- `style:` visual changes that do not alter behavior
- `refactor:` internal restructuring
- `test:` test-only changes
- `docs:` documentation
- `chore:` tooling, configuration, or maintenance

Use an imperative, concise commit summary.

PR descriptions should explain:

- what changed
- why it changed
- how it was validated
- any important implementation decisions

Include screenshots or the Vercel preview URL for visible UI changes when
useful.

## Deployment & Hosting

Vercel is the deployment and hosting platform for this project.

GitHub is the source of truth for the codebase. Vercel is connected to the
GitHub repository and should build and deploy changes from Git.

The intended deployment flow is:

feature branch
→ pull request
→ CI validation
→ Vercel preview deployment
→ review
→ merge to `main`
→ Vercel production deployment

Pull requests should be used to review both the code changes and, when
available, the Vercel preview before merging.

Merging to `main` should be treated as a production release because Vercel
automatically deploys the production branch.

Do not use Firebase Hosting for new deployments.

Before modifying deployment configuration, Vercel settings, build settings,
domains, redirects, or environment variables, explain the proposed change
and its implications first.

## Security & Configuration

Treat this repository as public.

Keep secrets and local `.env` files out of Git; use `.env.example` as the
optional configuration template. The site must build and render without
environment configuration.

Never put secrets in browser-exposed `VITE_*` variables.

Do not commit API keys, credentials, tokens, or other secrets.

If a change requires a new environment variable, document its name and
purpose without committing its secret value.
