type RelatedListing = {
  id: string;
  title: string;
  priceLabel: string;
  metadata: string;
  badge: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

type RelatedListingsProps = {
  listings: RelatedListing[];
};

export function RelatedListings({ listings }: RelatedListingsProps) {
  return (
    <section aria-label="Related listings" className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#16151D]">Related listings</h2>
        <p className="mt-1 text-sm text-[#6D627A]">Similar items from the catalog.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {listings.map((listing) => (
          <article key={listing.id} className="overflow-hidden rounded-[26px] border border-[#E7E0D5] bg-white shadow-[0_20px_55px_rgba(37,24,74,0.08)]">
            <a href={listing.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F3CC3] focus-visible:ring-offset-2">
              <div className="relative aspect-[4/3] bg-[#F6F1E8]">
                <span className="absolute left-4 top-4 rounded-full bg-[#6F3CC3] px-3 py-1 text-xs font-semibold text-white">{listing.badge}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.imageSrc} alt={listing.imageAlt} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-lg font-semibold text-[#16151D]">{listing.priceLabel}</p>
                <h3 className="text-base font-semibold text-[#16151D]">{listing.title}</h3>
                <p className="text-sm text-[#6D627A]">{listing.metadata}</p>
                <div className="flex gap-3 pt-1">
                  <span className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#DDD5C8] bg-[#F4EFE7] px-4 py-2 text-sm font-semibold text-[#16151D]">
                    Match
                  </span>
                  <span className="inline-flex h-10 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-[#5B4F6C]">
                    View
                  </span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
