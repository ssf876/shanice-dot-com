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
assertions. The smoke test renders the app with no `.env` present, so a fresh
clone passes out of the box.

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

1. **No secret is ever required to build or run the site.** Firebase
   configuration is read from Vite env vars (`import.meta.env.VITE_*` — see
   `.env.example`). Copy `.env.example` to `.env` and fill it in locally;
   `.env` and `.env.*` are gitignored, as are `src/firebase.js` and
   `src/firebaseConfig.js`. With no `.env` present the site builds and renders
   with Firebase uninitialized (`getFirebaseApp()` returns `null`).

2. **A Firebase web API key is public by design** — it ships in the browser
   bundle the moment Firebase is initialized. The real controls live on the
   provider side: rotate the key in the Google Cloud console and restrict it
   (HTTP referrer restrictions, API restrictions). Treat anything
   credential-shaped in this repo as exposed and rotate immediately.
