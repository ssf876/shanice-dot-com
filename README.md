# shanice-dot-com

Personal portfolio site for Shanice Sinclair — Vite + React, deployed and hosted with Vercel.

## Local development

```bash
npm install
npm run dev       # dev server with HMR
npm run lint      # ESLint
npm test          # Vitest suite, run once (vitest run)
npm run build     # production build → dist/
```

Tests use Vitest + Testing Library (jsdom) with jest-axe for accessibility
assertions. No `.env` is required to build, run, or test the site.

## Deploy

GitHub is the source of truth. Vercel is connected to the repository and builds
and deploys changes from Git. The production branch is `main`.

The intended deployment flow is:

feature branch → PR → CI → Vercel preview → merge to `main` → Vercel production deployment

CI runs `npm run lint`, `npm test`, and `npm run build` for pull requests targeting
`main`. Review the code and Vercel preview before merging. Merging to `main` is
a production release because Vercel automatically deploys that branch.

The root `index.html` is the Vite application entry point and loads
`src/main.jsx`. `npm run build` generates the production site in `dist/`.

## How credentials are handled

This repo is treated as **permanently public**. Two consequences:

1. **No secret or environment configuration is required to build or run the
   site.** `.env.example` documents this default. Local `.env` and `.env.*`
   files are gitignored, except for `.env.example`.

2. **Never put secrets in browser-exposed `VITE_*` variables.** Keep API keys,
   credentials, and tokens out of Git. Treat any committed secret as exposed
   and rotate it immediately.
