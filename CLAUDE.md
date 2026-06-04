# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DTP Uganda — "Uganda's Unified Digital Trade Infrastructure". A **frontend-only demo/prototype** (React 19 + Vite + Tailwind, React Router 7). There is no backend, no API, and no real persistence — all data is hardcoded sample data in `src/data/`, and the only browser persistence is `localStorage` (the logged-in user and selected language). Treat it as an interactive product mockup.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — ESLint (flat config in `eslint.config.js`)

There is no test framework configured.

## Architecture

### Provider stack & routing
`src/main.jsx` wraps the app in `BrowserRouter → AuthProvider → LanguageProvider`. All routes live in `src/App.jsx` using three guard components:

- **`PrivateRoute`** — requires a logged-in `user`, else redirects to `/login`.
- **`CompleteRoute`** — requires a logged-in user *with a completed profile* (`isProfileComplete()`), else redirects to `/incomplete`. Most dashboard routes use this.
- **`GuestRoute`** — for `/login` and `/register`; redirects authenticated users to `/dashboard` or `/incomplete`.

Many sidebar destinations are placeholders rendered via the shared `ComingSoon` page (e.g. `/suppliers`, `/facilities`, `/analytics`, `/registry`).

### Auth & the registration lifecycle (`src/context/AuthContext.jsx`)
Auth is entirely client-side against an in-memory `registeredUsers` list seeded from `SAMPLE_ACCOUNTS`. Login matches `username` **or** `phone` plus `password`. The logged-in account is mirrored to `localStorage` under `dtp_user`.

Registration is a multi-step flow tracked by the `regData` object (driven by `updateReg`). It moves accounts through a **two-phase model**: `phase: 1` = registered but no Trade ID yet (profile incomplete), `phase: 2` = `completeRegistration(tradeId)` has run and assigned a `tradeId`. `isProfileComplete()` returns true when the user has a `tradeId`, OR for the `ADMIN`/`GOU` roles automatically. Sample-account passwords are `password123`.

### Roles drive everything
Actors are typed by short **role codes** defined in `ACTOR_TYPES` (`src/data/constants.js`): `AGR` (Farmer), `VAP` (Processor), `MFR` (Manufacturer), `AGT` (Aggregator/Trader), `EXP` (Exporter), `IMP` (Importer), `BYR` (Buyer), `TRP` (Transporter), `CSM` (Consumer), plus `ADMIN`/`GOU` (government). These codes appear throughout the data and UI. Key role-keyed maps:

- `ROLE_NAV` in `src/components/layout/DashboardLayout.jsx` — the sidebar nav items per role.
- `BUYER_ROLES` and `ROLE_DEFAULT_CATEGORIES` in `src/data/demo.js` — which roles buy, and their default product categories.

When adding a role-specific feature, update the relevant role-keyed map(s) rather than branching ad hoc.

### Data layer (`src/data/`)
All domain data and the "API" helpers live here — there is no network layer to mock.

- `constants.js` — taxonomies: `ACTOR_TYPES`, `ENTITY_TYPES`, `MFR_SECTORS`, `VAP_PROCESSING_TYPES`, `PRODUCTS` (category → list), and `SAMPLE_ACCOUNTS` (login fixtures).
- `demo.js` — sample transactional data (`MARKET_PRICES`, `LISTINGS`, `PURCHASE_REQUESTS`, `TRANSACTIONS`, `BATCHES`, `VEHICLES`, `STORES`, stats, etc.) plus the `getActor*` accessor functions that filter this data by `username`/`role`. Includes formatters `formatUGX` / `formatNumber` and distance helpers (`DISTRICT_DISTANCES`, `getDistance`, `getAvailableTransporters`).
- `geo.js` — Uganda `REGIONS` / `SUB_REGIONS` / `DISTRICTS` hierarchy with lookup helpers.
- `seasonal.js` — `SEASONAL_CALENDAR` and `getSeasonalOutlook`.

**Runtime mutable state:** notifications are the one piece of in-session mutable state. `pushNotification`, `getRuntimeNotifications`, and `markAllRead` mutate a module-level `_runtimeNotifs` object; `getActorNotificationsFallbackWithRuntime` merges these with the static fallbacks. This state is lost on reload.

### Layout, i18n & styling
- `src/components/layout/DashboardLayout.jsx` is the shared shell for all authenticated pages (sidebar from `ROLE_NAV`, top bar, notifications, language switcher).
- `LanguageContext.jsx` defines 11 `LANGUAGES` and persists the choice to `localStorage` (`dtp_lang`). The switcher exists but UI strings are **not** actually translated — it's presentational.
- Tailwind with a custom palette in `tailwind.config.js`: use the named tokens `gold`, `ink`, and `warm` (e.g. `bg-warm-bg`, `text-ink`, `border-gold-border`) rather than raw hex.
- Icons come from `lucide-react`.

### Deployment
SPA on Vercel; `vercel.json` rewrites all paths to `/index.html` so client-side routes resolve on refresh.

## Conventions

- `.jsx` function components with hooks; ES modules (`"type": "module"`).
- `*.bak`, `*.bak2`, `*.bak3` files are git-ignored editor backups — ignore them; never edit or reference them.
- Pages live flat in `src/pages/`; shared UI in `src/components/` (layout shell under `src/components/layout/`).
