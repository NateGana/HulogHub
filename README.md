# HulogHub

**Save together. Grow together.**

HulogHub is a blockchain-powered Paluwagan savings platform prototype, built on
Next.js (App Router) + React + TypeScript + Tailwind CSS. It runs entirely as a
frontend demo — all data is generated on first run and persisted to your
browser's `localStorage`, so there is no backend or database to set up.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Demo Mode

This build simulates:
- A Stellar wallet connection (mock address, no private keys ever requested)
- Contribution/payout transactions and their "verification" on a demo ledger

Nothing in this prototype touches the real Stellar Network. See
`lib/stellar.ts` for the abstraction layer — every function there documents
exactly what a production Stellar SDK integration would look like.

## Project structure

```
app/                  Next.js App Router pages
  page.tsx            Public landing page
  (app)/              Authenticated app shell (sidebar + header + mobile nav)
    dashboard/
    groups/
    groups/[id]/
    contributions/
    payouts/
    transactions/
    wallet/
    members/
    notifications/
    reports/
    settings/
components/
  ui/                 Reusable design-system components
  layout/             Sidebar, Header, MobileNav
  groups/, contributions/, members/   Feature-specific components
context/
  AppDataContext.tsx  Single source of truth for all app state
hooks/
  use-toast.tsx       Toast notification system
lib/
  api.ts              Service-layer abstraction (localStorage today)
  stellar.ts           Demo Stellar service abstraction
  storage.ts          localStorage wrapper
  mock-data.ts        Seed data (Philippine-oriented demo users/groups)
  utils.ts            Formatting & date helpers
types/
  index.ts            Shared TypeScript types
```

## Notes

- Reset the demo data anytime from **Settings → Demo Data → Reset Demo Data**.
- Dark mode is available under **Settings → Appearance** and persists across
  sessions.
- HulogHub is a savings-coordination prototype, not a bank, investment
  platform, or licensed financial product.
