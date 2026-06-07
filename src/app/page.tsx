import React from 'react';

import { GlobalNav } from '../components/navigation/global-nav';
import { FilterToolbar } from '../components/listings/filter-toolbar';
import { ListingCard } from '../components/listings/listing-card';
import { seedListings } from '../data/seed-listings';
import { resolveListingImageSource } from '../lib/assets';
import { applyBrowseFilters, createDefaultListingFilters } from '../lib/listings/filters';

function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceCents / 100);
}

function getHomePageListings(category?: string) {
  const listings = ['owner-avery', 'owner-jordan']
    .flatMap((ownerId) => seedListings.findListingsByOwner(ownerId))
    .slice(0, 4)
    .map((listing) => ({
      ...listing,
      distanceMiles: 2,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    }));

  return applyBrowseFilters(listings, { ...createDefaultListingFilters(), category: category ?? '' }).map((listing) => {
    const image = resolveListingImageSource(listing.images[0]?.assetId);

    return {
      id: listing.id,
      title: listing.title,
      price: formatPrice(listing.priceCents),
      distance: 'Local pickup',
      condition: listing.condition,
      category: listing.category,
      imageAssetId: listing.images[0]?.assetId ?? image.assetId,
      href: `/listings/${listing.id}`,
    };
  });
}

export default function HomePage({ searchParams }: { searchParams?: { category?: string } }) {
  const listingPreview = getHomePageListings(searchParams?.category);

  return (
    <main className="min-h-screen bg-[#f8f3ec] text-slate-950">
      <GlobalNav />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <FilterToolbar totalResults={listingPreview.length} category={searchParams?.category ?? null} />

        <section aria-label="Listings" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {listingPreview.length > 0 ? (
            listingPreview.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          ) : (
            <div className="col-span-full rounded-[28px] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-12 text-center">
              <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">No listings match</h2>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Try changing the category filter or reset browse to restore the default listing set.</p>
              <a href="/" className="mt-6 inline-flex rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white">
                Reset browse
              </a>
            </div>
          )}
        </section>

        <section className="flex items-center justify-between rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <p>Showing 1-4 of 24 results</p>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-full border border-stone-200 px-3 py-1.5">
              Previous
            </button>
            <button type="button" className="rounded-full bg-slate-950 px-3 py-1.5 text-white">
              1
            </button>
            <button type="button" className="rounded-full border border-stone-200 px-3 py-1.5">
              2
            </button>
            <button type="button" className="rounded-full border border-stone-200 px-3 py-1.5">
              Next
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
