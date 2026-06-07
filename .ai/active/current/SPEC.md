---
feature: Marketplace App Phase 1
status: DRAFT
created: 2026-06-06
author: Strategist
linked_requirement: Marketplace app mockups-to-functional Phase 1
---

# SPEC: Marketplace App Phase 1

## Outcome
> Users can browse marketplace products, authenticate, manage their own listings, view listing details, and interact with profile reviews/ratings through a functional app that matches the visible mockups and provided product assets.

---

## Scope

### In Scope
- Build the marketplace UI and functionality represented by all image files under `requirements/mockups/` and `requirements/assets/products/`.
- Use provided product asset imagery as the source of truth for visible marketplace products and listing presentation.
- Authentication using credentials login/register flows sufficient to support protected marketplace actions.
- Browse experience for visible product/listing cards, navigation, category/filter/search/sort controls, tabs, buttons, and other visible interactions shown in mockups.
- Listing detail pages for visible listings, including product imagery, title, price, seller/profile linkage, description/details, and visible call-to-action behavior.
- Authenticated users can create, edit, and delete their own listings.
- Listing creation/editing must follow the visible mockups only and must not require an explicit add-listing image upload or image-selection input unless that control is visible in the mockups.
- Created/edited listings still display stable imagery in browse/detail/profile contexts by using seeded product assets, existing listing imagery, or a fallback/placeholder; browse and detail pages must continue to show listing imagery consistent with the visible mockups.
- Ownership enforcement: users can only edit or delete listings they created.
- Profile experience shown in mockups, including user information, user's listings, reviews, ratings, tabs, and visible profile actions.
- Reviews and ratings are in scope because they are visibly represented in the profile mockup.
- Navigation between all mockup-represented screens without manual URL entry.
- Persistent storage for users, listings, profiles, reviews, and ratings.
- Empty, loading, validation, and error states required to make the visible functionality usable.

### Out of Scope
- Payment processing, checkout, order management, escrow, shipping labels, and transaction settlement.
- Real-time chat, messaging inboxes, push notifications, email notifications, or SMS.
- Admin/moderation tooling unless visibly represented in the mockups.
- Social login providers beyond credentials authentication.
- Advanced recommendation engines or personalization beyond visible related/listing sections.
- External marketplace integrations, inventory synchronization, or third-party product imports.
- Production deployment, analytics dashboards, observability dashboards, and CI/CD setup.
- Features not visible in the mockups unless necessary for authentication, persistence, navigation, or ownership enforcement.

---

## Constraints

| Constraint | Value |
|------------|-------|
| Tech stack | Next.js 15 + React 19 + TypeScript; Tailwind CSS 4 + shadcn/ui; Next.js App Router route handlers/server actions; PostgreSQL + Prisma; Auth.js credentials auth; Zod; Playwright + Vitest |
| Performance | Core browse, detail, auth, listing-management, and profile screens must render without blank intermediate states; filtering/searching over seeded Phase 1 data should respond within 500ms after user action in local/test environments. |
| Security | Passwords must be hashed; credentials auth must protect create/edit/delete listing routes and actions; listing mutation must validate ownership server-side; all form input must be validated with Zod before persistence. |
| Accessibility | Interactive controls must be keyboard reachable; form inputs must have accessible labels; buttons/links must have discernible names; visible error states must be announced or associated with their fields. |

---

## Edge Cases

| Scenario | Input | Expected Behavior |
|----------|-------|-------------------|
| First-time visitor opens browse page | No authenticated session | Public browse content renders; protected actions route to authentication when attempted. |
| User submits empty login/register form | Missing required credentials | Inline validation errors appear; no account/session is created. |
| User submits invalid credentials | Unknown email or wrong password | Authentication fails with a user-visible error; user remains on auth flow. |
| User registers with existing email | Email already belongs to an account | Duplicate account is not created; user sees a clear error. |
| Browse data has no matches | Search/filter combination matching zero listings | Empty state appears with a way to clear or change filters. |
| User clears active filter/search | Active filter/search values | Browse list returns to default visible listing set. |
| Product asset missing or unavailable | Listing image path cannot be displayed | Stable fallback image/placeholder renders without breaking the card or detail page. |
| Visitor attempts to create listing | No authenticated session | User is redirected or prompted to log in before accessing listing creation. |
| Listing form submitted with invalid data | Empty title, invalid price, missing required fields, or unsupported hidden/system image reference | Validation errors appear; listing is not saved; user-facing create/edit forms do not require an explicit image input unless visible in the mockups. |
| Listing form submitted with boundary values | Minimum valid title/price/description values | Listing saves when values satisfy validation and displays correctly afterward. |
| User edits own listing | Authenticated owner with valid changes | Listing updates persist and updated details are visible on browse/detail/profile views. |
| User deletes own listing | Authenticated owner confirms delete | Listing is removed from browse/detail/profile views; direct access shows not found or equivalent safe state. |
| User attempts to edit/delete another user's listing | Authenticated non-owner | Action is denied server-side; no data changes; user sees unauthorized/not allowed feedback. |
| User opens deleted or unknown listing detail | Listing id does not exist | Not-found state renders without crashing. |
| Profile has no listings | Authenticated or public profile with zero listings | Profile renders with an empty listings state. |
| Profile has no reviews | Profile review count is zero | Reviews tab/section renders an empty reviews state and rating summary handles zero reviews. |
| Review submitted with invalid rating/content | Rating outside allowed range or missing required review data | Review is rejected with validation errors; rating aggregate does not change. |
| Navigation target unavailable | User clicks visible nav/tab/button | App either navigates to the represented screen/state or shows a safe unavailable state when the target is out of Phase 1 scope. |

---

## UX Flows

### Flow 1: Browse marketplace listings
**Role:** Visitor or authenticated user
**Entry point:** Marketplace home/browse page

1. Open the app at the default marketplace entry point.
   → Expected: The browse screen shown in the mockups renders with navigation, listing cards, product imagery from `requirements/assets/products/`, and visible controls.

2. Use visible category/filter/search/sort controls.
   → Expected: Listing results update according to the selected control state, or an empty state appears when no listings match.

3. Clear or change the selected controls.
   → Expected: Listing cards update without a blank or broken screen.

4. Select a visible listing card.
   → Expected: The listing detail screen opens for that listing.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 2: Authenticate with credentials
**Role:** Visitor
**Entry point:** Visible login/register navigation or protected action prompt

1. Open the login/register flow from the visible UI.
   → Expected: Authentication screen renders with required credential fields and submit controls.

2. Submit missing or invalid data.
   → Expected: User-visible validation or authentication error appears and no session is created.

3. Register or log in with valid credentials.
   → Expected: User becomes authenticated and returns to the relevant marketplace screen or authenticated landing state.

4. Use visible sign-out/account navigation if represented in the mockups.
   → Expected: Session ends and protected actions require authentication again.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 3: View listing detail
**Role:** Visitor or authenticated user
**Entry point:** Listing card from browse, profile listing section, or related listing section

1. Select a listing.
   → Expected: Detail page shows the listing imagery, title, price, description/details, seller/profile information, and visible actions from the mockups.

2. Use visible image/detail/navigation controls.
   → Expected: The selected image/state or navigation updates according to the mockup interaction.

3. Select seller/profile linkage where visible.
   → Expected: The seller profile screen opens.

4. Select any visible related/back/navigation control.
   → Expected: User moves to the represented destination without losing app state unexpectedly.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 4: Create a listing
**Role:** Authenticated user
**Entry point:** Visible create/sell/listing action

1. Select the visible action to create or sell a listing.
   → Expected: Listing creation form opens for authenticated users; visitors are sent to authentication first.

2. Submit the form with missing or invalid required data.
   → Expected: Field-level validation errors appear and no listing is created.

3. Submit the form with valid title, price, category/details, and description, without any explicit image input unless that input is visible in the mockups.
   → Expected: Listing is created and appears in browse, detail, and the user's profile listing views with stable imagery supplied by seeded product assets, existing listing imagery, or a fallback/placeholder.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 5: Edit and delete own listing
**Role:** Authenticated listing owner
**Entry point:** Own listing detail or profile listing management controls

1. Open a listing owned by the authenticated user.
   → Expected: Owner-only edit/delete controls are visible.

2. Edit the listing with valid changes.
   → Expected: Changes persist and are visible on detail, browse, and profile views.

3. Attempt to save invalid edits.
   → Expected: Validation errors appear and prior valid listing data remains unchanged.

4. Delete the listing and confirm if a confirmation step is represented.
   → Expected: Listing is removed and user is returned to a safe browse/profile state.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

### Flow 6: View profile, reviews, and ratings
**Role:** Visitor or authenticated user
**Entry point:** Seller/profile link, account/profile navigation, or listing detail seller section

1. Open a profile represented in the mockups.
   → Expected: Profile header/user information, ratings summary, reviews area, tabs, and listings render according to the mockup.

2. Switch visible profile tabs or sections.
   → Expected: The selected section becomes active and corresponding content or empty state is shown.

3. View reviews and ratings.
   → Expected: Existing reviews and aggregate rating are displayed; zero-review profiles show a stable empty state.

4. Submit or interact with review/rating controls when visibly represented and permitted.
   → Expected: Valid review/rating input persists and updates the profile summary; invalid input shows validation errors.

**Flow pass when:** all steps match expected, no manual URL editing required.
**Flow fail when:** any step redirects wrong, shows blank screen, or element does not respond.

---

## Acceptance Criteria

- [ ] **AC-1:** Given a visitor opens the marketplace entry point, when the page loads, then the browse UI shown in the mockups renders with navigation, listing cards, product imagery, and visible controls.
- [ ] **AC-2:** Given listings are visible on browse, when the user applies visible search/filter/category/sort controls, then the displayed listings update to match the selected criteria or show an empty state if none match.
- [ ] **AC-3:** Given a visible listing card exists, when the user selects it, then the listing detail page displays the listing's imagery, title, price, description/details, seller/profile linkage, and visible actions.
- [ ] **AC-4:** Given a visitor reaches the credentials auth flow, when required fields are missing or invalid, then clear validation or authentication errors are shown and no session is created.
- [ ] **AC-5:** Given a visitor provides valid registration or login credentials, when they submit the auth form, then an authenticated session is created and protected marketplace actions become available.
- [ ] **AC-6:** Given no authenticated session exists, when the visitor attempts to create a listing or access another protected listing-management action, then the app requires authentication before continuing.
- [ ] **AC-7:** Given an authenticated user submits a valid new listing using only fields visible in the mockups, when the listing is saved, then it persists and appears in browse, detail, and the user's profile listing views with stable imagery supplied by seeded product assets, existing listing imagery, or a fallback/placeholder.
- [ ] **AC-8:** Given an authenticated user submits invalid listing data, when they attempt to create or edit a listing, then field-level validation errors are shown and no invalid listing data is persisted; absence of a user-supplied image is not invalid unless the mockups visibly require an image field.
- [ ] **AC-9:** Given an authenticated user owns a listing, when they edit it with valid changes, then the updated listing persists and appears consistently across browse, detail, and profile views.
- [ ] **AC-10:** Given an authenticated user owns a listing, when they delete it, then it is removed from browse/detail/profile views and direct access resolves to a safe not-found state.
- [ ] **AC-11:** Given an authenticated user does not own a listing, when they attempt to edit or delete it, then the action is denied server-side and the listing remains unchanged.
- [ ] **AC-12:** Given a user opens a profile from visible navigation or seller linkage, when the profile loads, then profile information, tabs/sections, listings, rating summary, and reviews render as shown in the mockups.
- [ ] **AC-13:** Given a profile has no listings or no reviews, when the corresponding profile section is viewed, then a stable empty state appears without layout breakage.
- [ ] **AC-14:** Given reviews/ratings controls are visibly represented and the user is permitted to use them, when valid review/rating input is submitted, then the review persists and the profile rating summary updates.
- [ ] **AC-15:** Given invalid review/rating input is submitted, when validation runs, then the review is rejected and the rating aggregate remains unchanged.
- [ ] **AC-16:** Given any visible navigation item, tab, button, or link represented in the mockups, when the user activates it, then it either performs the represented in-scope action or routes to a safe state for explicitly out-of-scope destinations.

---

## Dependencies

| Type | Target | Notes |
|------|--------|-------|
| Reads | `requirements/mockups/` | All image files define visible Phase 1 screens, layout, controls, and interactions. |
| Reads | `requirements/assets/products/` | Product imagery/assets used for listing cards and detail screens. |
| Writes | `.ai/active/current/SPEC.md` | Current feature contract for approval. |
| Uses | Next.js App Router routes/server actions or route handlers | App navigation and server-backed user/listing/review operations. |
| Uses | PostgreSQL + Prisma | Persistent users, listings, profiles, reviews, and ratings. |
| Uses | Auth.js credentials auth | Registration/login/session handling for protected actions. |
| Uses | Zod | Validation for auth, listing, profile, review, and rating inputs. |

---

## Open Questions

No open questions. The user confirmed discovery framing and scope decisions.

---

## Approval

**Status:** DRAFT

SPEC is ready. Do you approve? Type 'approve' to continue or let me know what needs to change.
