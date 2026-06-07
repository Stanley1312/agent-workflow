import { ListingCard, type ListingCardData } from "@/components/listings/listing-card";

type ListingGridProps = {
  listings: ListingCardData[];
  emptyMessage?: string;
};

export function ListingGrid({ listings, emptyMessage = "No listings match your current filters." }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--border)] bg-white p-6 text-sm text-[color:var(--text-secondary)] shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
