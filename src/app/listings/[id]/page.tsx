import type { Metadata } from 'next';

import { resolveListingImageSource } from '../../../lib/assets';
import { seedListings } from '../../../data/seed-listings';
import { ListingGallery } from '../../../components/listings/listing-gallery';
import { ListingOwnerControls } from '../../../components/listings/owner-controls';
import { ListingSummaryCard } from '../../../components/listings/listing-summary-card';
import { RelatedListings } from '../../../components/listings/related-listings';

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceCents / 100);
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = seedListings.findListingById(id);
  if (!listing) {
    return { title: 'Listing not found | MatchMarket' };
  }

  return { title: `${listing.title} | MatchMarket` };
}

export async function getListingDetailNavigation({ listingId }: { listingId: string; viewerId: string | null }): Promise<{ sellerProfileHref: string }> {
  const listing = seedListings.findListingById(listingId);
  return { sellerProfileHref: `/profiles/${listing?.ownerId ?? 'unknown'}` };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listing = seedListings.findListingById(id);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const galleryImages = listing.images.map((image) => resolveListingImageSource(image.assetId));
  const primaryImage = galleryImages[0] ?? resolveListingImageSource();
  const sellerHref = `/profiles/${listing.ownerId}`;
  const relatedListings = seedListings
    .findListingsByOwner(listing.ownerId)
    .filter((item) => item.id !== listing.id)
    .slice(0, 3)
    .map((item, index) => {
      const image = resolveListingImageSource(item.images[0]?.assetId);
      return {
        id: item.id,
        title: item.title,
        priceLabel: formatPrice(item.priceCents),
        metadata: `${item.condition} · ${item.category}`,
        badge: index === 0 ? 'Offer' : 'Want',
        imageSrc: image.src,
        imageAlt: image.alt,
        href: `/listings/${item.id}`,
      };
    });

  return (
    <main className="min-h-screen bg-[#FBF8F2] px-6 py-8 text-[#16151D] lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6D627A]">Catalog</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#6D627A]">
            <a href="/" className="font-semibold text-[#6F3CC3] hover:underline">
              Back to browse
            </a>
            <span className="rounded-full bg-[#F4EFE7] px-3 py-1 font-semibold text-[#5B4F6C]">{listing.category}</span>
            <span className="rounded-full bg-[#F4EFE7] px-3 py-1 font-semibold text-[#5B4F6C]">{listing.condition}</span>
            <span className="rounded-full bg-[#F4EFE7] px-3 py-1 font-semibold text-[#5B4F6C]">Available now</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#16151D] lg:text-5xl">{listing.title}</h1>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)] lg:items-start">
          <div className="space-y-8">
            <ListingGallery title={listing.title} images={galleryImages.length > 0 ? galleryImages : [primaryImage]} selectedIndex={0} />

            <section className="rounded-[28px] border border-[#E7E0D5] bg-white p-6 shadow-[0_22px_70px_rgba(37,24,74,0.08)]">
              <h2 className="text-xl font-semibold tracking-tight">Description</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5B4F6C]">{listing.description}</p>
            </section>
          </div>

          <div className="space-y-6">
            <ListingSummaryCard
              priceLabel={formatPrice(listing.priceCents)}
              title={listing.title}
              condition={listing.condition}
              status="Active listing"
              facts={[
                { label: 'Category', value: listing.category },
                { label: 'Location', value: 'Local pickup' },
                { label: 'Item name', value: listing.title },
              ]}
              sellerName={listing.ownerId}
              sellerHref={sellerHref}
              startDealHref={`/signin?callbackUrl=${encodeURIComponent(`/listings/${listing.id}`)}`}
              relatedProposal={<div className="rounded-3xl border border-[#DDD5C8] bg-white p-4 text-sm text-[#5B4F6C]">Related proposal details appear here.</div>}
            />

            <ListingOwnerControls
              listingId={listing.id}
              ownerId={listing.ownerId}
              viewerId={null}
              editHref={`/listings/${listing.id}/edit`}
              deleteActionHref="/listings/actions"
            />
          </div>
        </section>

        <RelatedListings listings={relatedListings} />
      </div>
    </main>
  );
}
