# Repository Guidelines

## Project Structure & Module Organization

This personal portfolio uses React, Vite, and React Router, with Firebase Hosting. `src/main.jsx` initializes the app; `src/App.jsx` defines routes. Page components live in `src/pages/`, shared UI in `src/components/`, hooks in `src/hooks/`, and utilities in `src/lib/`.

Edit portfolio data in `src/content/profile.js` and `src/content/projects.js`. Writing posts live in `src/content/posts/`; Markdown filenames become URL slugs. Shared design tokens are in `src/styles/tokens.css`, with global styles in `src/index.css`. Static assets belong in `public/`; production output goes to generated `dist/`.

## Build, Test, and Development Commands

Use Node.js 20 to match CI.

- `npm ci`: install dependencies from the committed lockfile.
- `npm run dev`: start Vite with hot module replacement.
- `npm run lint`: run ESLint across JavaScript and JSX.
- `npm test`: run the Vitest suite once.
- `npm run build`: generate the production site in `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions

Follow existing code: two-space indentation, single-quoted JavaScript strings, no semicolons, and ES modules. Use PascalCase for component files, camelCase for helpers, and `use` prefixes for hooks. Use descriptive kebab-case Markdown filenames, such as `hello-world.md`. Reuse design tokens and keep editable content separate from components. ESLint enforces recommended JavaScript and React Hooks rules; no formatter is configured.

## Testing Guidelines

Tests use Vitest, Testing Library, jsdom, and jest-axe. Keep utility tests beside their modules as `*.test.js`; page, route, and content validation tests belong in `src/test/`, using `*.test.jsx` for JSX. Shared setup and fixtures also live there. Cover changed behavior, including accessibility for UI changes. No numeric coverage threshold is configured. Run lint, tests, and build before opening a PR; CI runs all three for PRs targeting `main`.

## Commit & Pull Request Guidelines

Recent commits use concise prefixes such as `feat:`, though older history varies. Follow that style with an imperative summary. Describe the change and validation in PRs, link relevant issues, and include screenshots for visible UI changes.

## Security & Configuration

Treat this repository as public. Keep secrets and local `.env` files out of Git; use `.env.example` as the optional configuration template. The site must build and render without environment configuration. Never put secrets in browser-exposed `VITE_*` variables.
