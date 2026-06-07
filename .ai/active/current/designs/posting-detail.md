# Screen Analysis: Posting Detail

## Source
`requirements/mockups/p1_posting_detail_screen.png`

## Layout Map
1. Global top navigation
   - Same nav/header as browse with Browse active and user controls
2. Detail header
   - Breadcrumb label CATALOG
   - Listing title
   - Metadata chips: back link, deal type, category, location, item name
   - Active status pill at right
3. Main detail content
   - Left large product gallery hero image
   - Thumbnail strip below hero image
   - Right sticky summary card with price, product title, condition/status, listing facts, seller summary, Start a deal button, Message and Save actions, related proposal card
4. Description panel
   - Section title DESCRIPTION
   - Detailed copy about listing condition and transaction expectations
5. Related listings section
   - Three-card row of similar listing cards with offer/want badges, image, price, title, metadata, Match and View actions

## Visual Notes
- Same warm background and card surfaces.
- Detail layout is two-column: image-led content and compact side rail.
- Status and category chips are small rounded pills.
- Purple is reserved for active category/proposal accents; black is primary CTA.

## Interaction Notes
- Thumbnail clicks change selected image.
- Seller summary links to profile.
- Start a deal / Message / Save are visible actions; unavailable or protected actions should route safely.
- Related cards navigate to detail.
