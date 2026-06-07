# Screen Analysis: Browse Posting

## Source
`requirements/mockups/p1_browse_posting_screen.png`

## Layout Map
1. Global top navigation
   - Left brand mark and MatchMarket logo
   - Primary nav links: Inbox, Postings, Browse active, Deals
   - Center/right search input
   - Purple Post button, notification icon, circular user avatar
2. Catalog header card
   - Breadcrumb label CATALOG
   - Page title Browse
   - Result summary text
   - Filter toolbar with category, price, distance, condition, sort, reset, tabs, and save-search action
3. Listing grid
   - Responsive card grid, four columns on desktop
   - Product image area
   - Price, title, distance/condition metadata
   - Primary Match button and secondary View link
4. Pagination/footer controls
   - Result count, previous/next, numbered pages, per-page control

## Visual Notes
- Warm off-white page background with white rounded panels.
- Compact, marketplace-dashboard styling.
- Primary action color is dark near-black for card Match buttons; brand/action accent is purple.
- Cards use subtle borders, rounded corners, and large product imagery.

## Interaction Notes
- Search/filter/category/sort controls update listing results.
- Reset clears active controls.
- Listing card or View opens detail.
- Match is a visible listing action; protected behavior may require authentication.
- Post opens create-listing flow for authenticated users or auth for visitors.
