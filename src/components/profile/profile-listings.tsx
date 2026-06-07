import type { ReactNode } from 'react';

export type ProfileListingItem = {
  id: string;
  title: string;
  priceLabel: string;
  description: string;
  href?: string;
};

type ProfileListingsProps = {
  listings: ProfileListingItem[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  action?: ReactNode;
};

export function ProfileListings({
  listings,
  emptyStateTitle = 'No listings yet',
  emptyStateDescription = 'This seller has not posted any listings.',
  action,
}: ProfileListingsProps) {
  if (listings.length === 0) {
    return (
      <section className="rounded-lg border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[color:var(--text-primary)]">{emptyStateTitle}</h2>
            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{emptyStateDescription}</p>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[color:var(--border)] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-[color:var(--text-primary)]">Listings</h2>
        {action ? <div>{action}</div> : null}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => {
          const content = (
            <>
              <div className="h-36 rounded-md bg-[color:var(--surface-alt)]" />
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-[color:var(--text-primary)]">{listing.title}</h3>
                  <span className="text-base font-bold text-[color:var(--text-primary)]">{listing.priceLabel}</span>
                </div>
                <p className="text-sm text-[color:var(--text-secondary)]">{listing.description}</p>
              </div>
            </>
          );

          return listing.href ? (
            <a
              key={listing.id}
              href={listing.href}
              className="overflow-hidden rounded-md border border-[color:var(--border)] bg-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
            >
              {content}
            </a>
          ) : (
            <article key={listing.id} className="overflow-hidden rounded-md border border-[color:var(--border)] bg-white shadow-sm">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
