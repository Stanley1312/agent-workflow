import React from 'react';

import { resolveListingImageSource } from '../../lib/assets';

export type ListingCardData = {
  id: string;
  title: string;
  price: string;
  category?: string;
  distance?: string;
  condition?: string;
  imageAssetId?: string | null;
  href?: string;
};

type ListingCardProps = {
  listing: ListingCardData;
};

function buildListingCardDescription(listing: ListingCardData): string {
  const details = [listing.category, listing.distance, listing.condition].filter(Boolean);
  return details.length > 0 ? details.join(' • ') : 'Marketplace listing';
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageSource = resolveListingImageSource(listing.imageAssetId);
  const href = listing.href ?? `/listings/${listing.id}`;

  return (
    <article className="group overflow-hidden rounded-[16px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm transition duration-150 hover:-translate-y-px hover:shadow-md">
      <a aria-label={`View ${listing.title}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2" href={href}>
        <div className="aspect-[4/3] bg-[color:var(--surface-alt)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={imageSource.alt} className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.01]" src={imageSource.src} />
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg font-bold leading-tight text-[color:var(--text-primary)]">{listing.title}</h3>
              <p className="text-sm text-[color:var(--text-secondary)]">{buildListingCardDescription(listing)}</p>
            </div>
            <p className="shrink-0 text-lg font-bold text-[color:var(--text-primary)]">{listing.price}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[color:var(--text-secondary)]">
              {listing.category ?? 'Listing'}
            </span>
            <span className="rounded-full bg-[color:var(--primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">Match</span>
          </div>
        </div>
      </a>
    </article>
  );
}
