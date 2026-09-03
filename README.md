# shanice-dot-com

Personal portfolio site for Shanice Sinclair — Vite + React, deployed to Firebase Hosting.

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

```bash
npm run build && npx firebase deploy
```

The Hosting target comes from `.firebaserc` (project `shanicedotcom-62fa1`);
`firebase.json` serves `dist/` with SPA rewrites. `firebase deploy` needs
Firebase auth on your machine first (`npx firebase login`), so deploys run
where you're logged in, not in CI.

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
