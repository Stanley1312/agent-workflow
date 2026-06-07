---
feature: Marketplace App Phase 1
created: 2026-06-06
spec_approved: 2026-06-06
---

# PLAN: Marketplace App Phase 1

## Approach
Build MatchMarket as a full-stack Next.js 15 App Router marketplace using Prisma/PostgreSQL for persistent users, listings, profiles, reviews, and ratings; Auth.js credentials for session handling; Zod for every server-side mutation contract; and Tailwind CSS 4 plus shadcn/ui-style primitives for the mockup-matched interface. The current repository has workflow files and requirements assets but no application source tree, so the first waves establish the app structure, typed data layer, and test harness before feature UI waves. Follow `DESIGN.md` and the per-screen analyses in `.ai/active/current/designs/` for all visual work, and avoid the documented Playwright pitfall by importing `test`/`expect` from `@playwright/test` and configuring test types before adding E2E coverage.

---

## Wave 1: Data Model and Persistence

**Goal:** Establish the application foundation, persistent marketplace data model, seeded product/listing/profile/review data, and shared validation contracts required by all downstream behavior. Listing imagery in this foundation supports browse/detail/profile display from seeded assets, existing listing imagery, or fallback placeholders; create/edit validation must not require an explicit user-supplied image unless the mockups visibly show that input.
**Dependencies:** None
**Files touched:**
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/prisma.ts`
- `src/lib/password.ts`
- `src/lib/assets.ts`
- `src/lib/validation/auth.ts`
- `src/lib/validation/listing.ts`
- `src/lib/validation/review.ts`
- `src/lib/ratings.ts`
- `src/data/seed-listings.ts`
- `src/data/product-assets.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `tests/persistence.test.ts`
- `tests/validation.test.ts`

**Test file:** `tests/persistence.test.ts`, `tests/validation.test.ts`

**Tasks:**
- [ ] Tester: write RED tests for AC-7, AC-8, AC-13, AC-14, AC-15 data persistence/validation foundations, including happy path listing persistence without required user-supplied image input, invalid input, boundary values, empty profile data, and display-image fallback reference cases.
- [ ] Tester: confirm test files use domain names, not wave-numbered names.

**Parallel Group 1:** (run simultaneously)
- Implementor A: scaffold Next.js 15, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright, Prisma, Auth.js, Zod, and shadcn/ui-compatible project configuration — files: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`
- Implementor B: define Prisma schema for User, Profile, Listing, ListingImage, Review, Rating-derived aggregates, ownership relations, timestamps, and indexes — files: `prisma/schema.prisma`, `src/lib/prisma.ts`
- Implementor C: create product asset registry and seed data reflecting all visible product assets and mockup listings — files: `src/data/product-assets.ts`, `src/data/seed-listings.ts`, `prisma/seed.ts`, `src/lib/assets.ts`
- Implementor D: create Zod validation modules and rating aggregate utility; listing create/edit validation requires visible form fields only and does not require an explicit user-supplied image unless shown in mockups — files: `src/lib/validation/auth.ts`, `src/lib/validation/listing.ts`, `src/lib/validation/review.ts`, `src/lib/ratings.ts`, `src/lib/password.ts`

**Sequential — depends on Group 1:**
- Implementor: wire seed data to Prisma model shape and refactor the wave for typed imports, no magic numbers, and deterministic local/test data — files: `prisma/seed.ts`, `src/data/seed-listings.ts`, `src/lib/assets.ts`

---

## Wave 2: Authentication and Authorization

**Goal:** Provide credentials registration/login/session behavior and server-side access controls for protected listing and review actions.
**Dependencies:** Wave 1: Data Model and Persistence
**Files touched:**
- `src/auth.ts`
- `src/middleware.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/(auth)/signin/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/auth-actions.ts`
- `src/components/auth/auth-shell.tsx`
- `src/components/auth/auth-form.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/checkbox.tsx`
- `tests/authentication.test.ts`

**Test file:** `tests/authentication.test.ts`

**Tasks:**
- [ ] Tester: write RED tests for AC-4, AC-5, AC-6, and ownership/auth preconditions from AC-11, covering empty forms, invalid credentials, duplicate email, valid registration/login, sign-out, and protected action redirects.

**Parallel Group 1:** (run simultaneously)
- Implementor A: implement Auth.js credentials provider, password hashing verification, session callbacks, and route handler — files: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/password.ts`
- Implementor B: implement auth server actions for registration, login helper flows, duplicate email handling, and Zod-backed validation — files: `src/app/(auth)/auth-actions.ts`, `src/lib/validation/auth.ts`
- Implementor C: build auth UI primitives and shared split-screen auth shell following `designs/signin.md` and `designs/signup.md` — files: `src/components/auth/auth-shell.tsx`, `src/components/auth/auth-form.tsx`, `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/checkbox.tsx`

**Sequential — depends on Group 1:**
- Implementor: compose sign-in/sign-up pages, route between tabs/pages, add protected-route middleware, and ensure authenticated redirects preserve intended marketplace action — files: `src/app/(auth)/signin/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/middleware.ts`, `src/auth.ts`

---

## Wave 3: Browse and Listing Detail

**Goal:** Render the public marketplace browse and listing detail experiences with product imagery, controls, listing cards, details, seller links, related listings, fallback states, and safe unavailable navigation.
**Dependencies:** Wave 1: Data Model and Persistence, Wave 2: Authentication and Authorization
**Files touched:**
- `src/app/page.tsx`
- `src/app/listings/[id]/page.tsx`
- `src/app/listings/not-found.tsx`
- `src/components/navigation/global-nav.tsx`
- `src/components/listings/listing-card.tsx`
- `src/components/listings/listing-grid.tsx`
- `src/components/listings/filter-toolbar.tsx`
- `src/components/listings/listing-gallery.tsx`
- `src/components/listings/listing-summary-card.tsx`
- `src/components/listings/related-listings.tsx`
- `src/lib/listings/queries.ts`
- `src/lib/listings/filters.ts`
- `tests/browse.test.ts`
- `tests/listing-detail.test.ts`

**Test file:** `tests/browse.test.ts`, `tests/listing-detail.test.ts`

**Tasks:**
- [ ] Tester: write RED tests for AC-1, AC-2, AC-3, AC-6, AC-10 direct-access safe not-found behavior, and AC-16 browse/detail navigation, including no-match filters, clearing filters, missing image fallback, and unknown listing id.

**Parallel Group 1:** (run simultaneously)
- Implementor A: build global navigation and browse catalog header/filter toolbar from `designs/browse-posting.md` — files: `src/components/navigation/global-nav.tsx`, `src/components/listings/filter-toolbar.tsx`, `src/app/page.tsx`
- Implementor B: build listing query/filter helpers for category, price, distance, condition, search, sort, empty state, and clear/reset behavior — files: `src/lib/listings/queries.ts`, `src/lib/listings/filters.ts`
- Implementor C: build listing card/grid components with product imagery and fallback asset handling — files: `src/components/listings/listing-card.tsx`, `src/components/listings/listing-grid.tsx`, `src/lib/assets.ts`
- Implementor D: build listing detail gallery, summary card, description, related listing section, and not-found state from `designs/posting-detail.md` — files: `src/app/listings/[id]/page.tsx`, `src/app/listings/not-found.tsx`, `src/components/listings/listing-gallery.tsx`, `src/components/listings/listing-summary-card.tsx`, `src/components/listings/related-listings.tsx`

**Sequential — depends on Group 1:**
- Implementor: integrate browse cards and related cards with detail navigation, seller/profile links, protected Start a deal/Match/Post routing, and safe unavailable states for out-of-scope destinations — files: `src/app/page.tsx`, `src/app/listings/[id]/page.tsx`, `src/components/navigation/global-nav.tsx`, `src/components/listings/listing-card.tsx`, `src/components/listings/listing-summary-card.tsx`

---

## Wave 4: Listing Management

**Goal:** Let authenticated users create, edit, and delete their own listings while enforcing validation and ownership server-side.
**Dependencies:** Wave 1: Data Model and Persistence, Wave 2: Authentication and Authorization, Wave 3: Browse and Listing Detail
**Files touched:**
- `src/app/listings/new/page.tsx`
- `src/app/listings/[id]/edit/page.tsx`
- `src/app/listings/actions.ts`
- `src/components/listings/listing-form.tsx`
- `src/components/listings/owner-controls.tsx`
- `src/lib/listings/mutations.ts`
- `src/lib/listings/authorization.ts`
- `src/lib/profiles/queries.ts`
- `tests/listing-management.test.ts`

**Test file:** `tests/listing-management.test.ts`

**Tasks:**
- [ ] Tester: write RED tests for AC-6, AC-7, AC-8, AC-9, AC-10, and AC-11, covering visitor redirects, valid create, invalid create/edit, minimum valid boundary values, owner-only controls, non-owner denial, delete removal, and safe direct access after delete.

**Parallel Group 1:** (run simultaneously)
- Implementor A: implement listing mutation service with create, update, delete, ownership checks, and Zod validation — files: `src/lib/listings/mutations.ts`, `src/lib/listings/authorization.ts`, `src/app/listings/actions.ts`, `src/lib/validation/listing.ts`
- Implementor B: build reusable listing form with accessible labels, validation errors, only mockup-visible create/edit fields, no required image/asset selection unless visible in the mockups, and boundary-value support — files: `src/components/listings/listing-form.tsx`, `src/components/ui/input.tsx`, `src/components/ui/button.tsx`
- Implementor C: build owner-only edit/delete controls and confirmation behavior where represented safely — files: `src/components/listings/owner-controls.tsx`, `src/app/listings/[id]/page.tsx`
- Implementor D: implement the minimal profile listing query capability needed to verify created, edited, and deleted listings appear consistently in a user's profile listing view; defer profile header, reviews, ratings, tabs, and full profile page composition to Wave 5 — files: `src/lib/profiles/queries.ts`

**Sequential — depends on Group 1:**
- Implementor: compose create/edit pages, connect mutations to navigation, and ensure browse/detail/profile listing consistency after mutations using the minimal profile listing query; full profile UI composition remains Wave 5 — files: `src/app/listings/new/page.tsx`, `src/app/listings/[id]/edit/page.tsx`, `src/app/listings/actions.ts`, `src/app/page.tsx`, `src/app/listings/[id]/page.tsx`, `src/lib/profiles/queries.ts`

---

## Wave 5: Profiles Reviews and Ratings

**Goal:** Render profile information, listings, reviews, ratings, tabs/sections, empty states, and permitted review/rating interactions.
**Dependencies:** Wave 1: Data Model and Persistence, Wave 2: Authentication and Authorization, Wave 3: Browse and Listing Detail, Wave 4: Listing Management
**Files touched:**
- `src/app/profiles/[id]/page.tsx`
- `src/app/profiles/[id]/actions.ts`
- `src/components/profile/profile-header.tsx`
- `src/components/profile/profile-stats.tsx`
- `src/components/profile/profile-tabs.tsx`
- `src/components/profile/profile-listings.tsx`
- `src/components/profile/reviews-panel.tsx`
- `src/components/profile/review-form.tsx`
- `src/lib/profiles/queries.ts`
- `src/lib/reviews/mutations.ts`
- `src/lib/ratings.ts`
- `tests/profile.test.ts`
- `tests/reviews.test.ts`

**Test file:** `tests/profile.test.ts`, `tests/reviews.test.ts`

**Tasks:**
- [ ] Tester: write RED tests for AC-12, AC-13, AC-14, AC-15, and AC-16 profile navigation/tabs, covering profile render, seller linkage, no listings, no reviews, valid review persistence, invalid rating/content rejection, and aggregate stability.

**Parallel Group 1:** (run simultaneously)
- Implementor A: extend the Wave 4 minimal profile listing query into full profile query helpers for profile header data, tabs, reviews, ratings, empty states, and profile page data loading — files: `src/lib/profiles/queries.ts`, `src/app/profiles/[id]/page.tsx`
- Implementor B: build profile header, stats cards, tabs, and listing section from `designs/profile.md` — files: `src/components/profile/profile-header.tsx`, `src/components/profile/profile-stats.tsx`, `src/components/profile/profile-tabs.tsx`, `src/components/profile/profile-listings.tsx`
- Implementor C: implement review mutation service and rating aggregate updates with Zod validation — files: `src/lib/reviews/mutations.ts`, `src/app/profiles/[id]/actions.ts`, `src/lib/validation/review.ts`, `src/lib/ratings.ts`
- Implementor D: build reviews panel and review form, including empty reviews and invalid input states — files: `src/components/profile/reviews-panel.tsx`, `src/components/profile/review-form.tsx`

**Sequential — depends on Group 1:**
- Implementor: integrate seller/profile links from listing detail and global/account navigation, ensure owner profile edit button visibility, and verify profile listings update after listing mutations — files: `src/app/profiles/[id]/page.tsx`, `src/app/listings/[id]/page.tsx`, `src/components/navigation/global-nav.tsx`, `src/components/profile/profile-listings.tsx`

---

## Wave 6: UI/E2E

**Goal:** Implement final UI polish against `DESIGN.md` and run Playwright automation for all UX Flows in SPEC.
**Dependencies:** Wave 1: Data Model and Persistence, Wave 2: Authentication and Authorization, Wave 3: Browse and Listing Detail, Wave 4: Listing Management, Wave 5: Profiles Reviews and Ratings all GREEN
**Files touched:**
- `playwright.config.ts`
- `src/e2e/marketplace.spec.ts`
- `src/e2e/authentication.spec.ts`
- `src/e2e/listings.spec.ts`
- `src/e2e/profiles.spec.ts`
- `src/components/navigation/global-nav.tsx`
- `src/components/listings/filter-toolbar.tsx`
- `src/components/listings/listing-card.tsx`
- `src/components/listings/listing-gallery.tsx`
- `src/components/listings/listing-summary-card.tsx`
- `src/components/listings/listing-form.tsx`
- `src/components/profile/profile-header.tsx`
- `src/components/profile/reviews-panel.tsx`
- `src/components/auth/auth-shell.tsx`
- `src/app/globals.css`

**Test file:** `src/e2e/marketplace.spec.ts`, `src/e2e/authentication.spec.ts`, `src/e2e/listings.spec.ts`, `src/e2e/profiles.spec.ts`

**Tasks:**
- [ ] Implementor: configure Playwright for Next.js, stable test database/seed setup, test isolation, and a readiness probe that uses available project tooling rather than assuming a `python` executable — files: `playwright.config.ts`
- [ ] Tester: write RED Playwright tests for UX Flow 1 through UX Flow 6 after `playwright.config.ts` exists, importing `test` and `expect` from `@playwright/test`, avoiding wave-numbered filenames, and covering keyboard-reachable controls, validation visibility, and no blank screens — files: `src/e2e/marketplace.spec.ts`, `src/e2e/authentication.spec.ts`, `src/e2e/listings.spec.ts`, `src/e2e/profiles.spec.ts`

**Parallel Group 1 — after RED E2E tests are confirmed:** (run simultaneously)
- Implementor A: polish browse and detail UI layout sections from `designs/browse-posting.md` and `designs/posting-detail.md`, including nav, catalog header, filters, grid, pagination, gallery, summary side rail, description, and related listings — files: `src/components/navigation/global-nav.tsx`, `src/components/listings/filter-toolbar.tsx`, `src/components/listings/listing-card.tsx`, `src/components/listings/listing-gallery.tsx`, `src/components/listings/listing-summary-card.tsx`, `src/app/globals.css`
- Implementor B: polish auth and profile UI sections from `designs/signin.md`, `designs/signup.md`, and `designs/profile.md`, including split auth marketing panels, auth cards, profile hero, stats cards, reviews panel, tabs, and empty states — files: `src/components/auth/auth-shell.tsx`, `src/components/auth/auth-form.tsx`, `src/components/profile/profile-header.tsx`, `src/components/profile/profile-stats.tsx`, `src/components/profile/profile-tabs.tsx`, `src/components/profile/reviews-panel.tsx`, `src/app/globals.css`

**Sequential — depends on Group 1:**
- Implementor: final accessibility and responsive pass for all visible mockup screens, ensuring controls have discernible names, field errors are associated/announced, safe unavailable states are reachable, no layout breaks across empty/loading/error states, and all Playwright UX Flow tests pass once local Next.js tooling is installed — files: `src/app/globals.css`, `src/components/navigation/global-nav.tsx`, `src/components/listings/listing-form.tsx`, `src/components/profile/review-form.tsx`, `src/components/auth/auth-form.tsx`, `src/e2e/marketplace.spec.ts`, `src/e2e/authentication.spec.ts`, `src/e2e/listings.spec.ts`, `src/e2e/profiles.spec.ts`

---

## Wave Dependency Graph

Wave 1: Data Model and Persistence -> Wave 2: Authentication and Authorization -> Wave 3: Browse and Listing Detail -> Wave 4: Listing Management -> Wave 5: Profiles Reviews and Ratings -> Wave 6: UI/E2E

**Re-run scope rules:**
| Wave that breaks | Must re-run |
|-----------------|-------------|
| Wave 1: Data Model and Persistence | Wave 1 + all downstream waves |
| Wave 2: Authentication and Authorization | Wave 2 + all downstream waves |
| Wave 3: Browse and Listing Detail | Wave 3 + all downstream waves |
| Wave 4: Listing Management | Wave 4 + all downstream waves |
| Wave 5: Profiles Reviews and Ratings | Wave 5 + Wave 6 |
| Wave 6: UI/E2E | Wave 6 only |

---

## AC Coverage Map

| AC | Wave | Test file |
|----|------|-----------|
| AC-1 | Wave 3: Browse and Listing Detail; Wave 6: UI/E2E | `tests/browse.test.ts`, `src/e2e/marketplace.spec.ts` |
| AC-2 | Wave 3: Browse and Listing Detail; Wave 6: UI/E2E | `tests/browse.test.ts`, `src/e2e/marketplace.spec.ts` |
| AC-3 | Wave 3: Browse and Listing Detail; Wave 6: UI/E2E | `tests/listing-detail.test.ts`, `src/e2e/listings.spec.ts` |
| AC-4 | Wave 2: Authentication and Authorization; Wave 6: UI/E2E | `tests/authentication.test.ts`, `src/e2e/authentication.spec.ts` |
| AC-5 | Wave 2: Authentication and Authorization; Wave 6: UI/E2E | `tests/authentication.test.ts`, `src/e2e/authentication.spec.ts` |
| AC-6 | Wave 2: Authentication and Authorization; Wave 4: Listing Management; Wave 6: UI/E2E | `tests/authentication.test.ts`, `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-7 | Wave 1: Data Model and Persistence; Wave 4: Listing Management; Wave 6: UI/E2E | `tests/persistence.test.ts`, `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-8 | Wave 1: Data Model and Persistence; Wave 4: Listing Management; Wave 6: UI/E2E | `tests/validation.test.ts`, `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-9 | Wave 4: Listing Management; Wave 6: UI/E2E | `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-10 | Wave 3: Browse and Listing Detail; Wave 4: Listing Management; Wave 6: UI/E2E | `tests/listing-detail.test.ts`, `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-11 | Wave 2: Authentication and Authorization; Wave 4: Listing Management; Wave 6: UI/E2E | `tests/authentication.test.ts`, `tests/listing-management.test.ts`, `src/e2e/listings.spec.ts` |
| AC-12 | Wave 5: Profiles Reviews and Ratings; Wave 6: UI/E2E | `tests/profile.test.ts`, `src/e2e/profiles.spec.ts` |
| AC-13 | Wave 1: Data Model and Persistence; Wave 5: Profiles Reviews and Ratings; Wave 6: UI/E2E | `tests/persistence.test.ts`, `tests/profile.test.ts`, `src/e2e/profiles.spec.ts` |
| AC-14 | Wave 1: Data Model and Persistence; Wave 5: Profiles Reviews and Ratings; Wave 6: UI/E2E | `tests/persistence.test.ts`, `tests/reviews.test.ts`, `src/e2e/profiles.spec.ts` |
| AC-15 | Wave 1: Data Model and Persistence; Wave 5: Profiles Reviews and Ratings; Wave 6: UI/E2E | `tests/validation.test.ts`, `tests/reviews.test.ts`, `src/e2e/profiles.spec.ts` |
| AC-16 | Wave 3: Browse and Listing Detail; Wave 5: Profiles Reviews and Ratings; Wave 6: UI/E2E | `tests/browse.test.ts`, `tests/profile.test.ts`, `src/e2e/marketplace.spec.ts` |
