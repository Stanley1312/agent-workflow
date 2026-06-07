import { seedListings } from '../../data/seed-listings';
import { resolveListingImageSource } from '../assets';
import { getManagedListings, getManagedListingsByOwner, isListingDeleted } from './mutations';
import type { ListingFilterState, ListingFilters, ListingSortOption } from './filters';
import { applyBrowseFilters, createDefaultListingFilters, createListingFilterState } from './filters';

const BROWSE_OWNER_IDS = ['owner-avery', 'owner-jordan'];

export type BrowseListing = {
  id: string;
  title: string;
  category: string;
  condition: string;
  priceCents: number;
  image: { src: string; alt: string };
  href: string;
};

export type ListingDetail = {
  id: string;
  title: string;
  priceCents: number;
  description: string;
  seller: { id: string; displayName: string; profileHref: string };
  primaryImage: { src: string; alt: string };
  actions: Array<{ label: string; href: string }>;
};

export async function getBrowseListings({ filters }: { viewerId: string | null; filters: Partial<Record<string, string>> }): Promise<BrowseListing[]> {
  const activeFilters = createListingFilterState(filters);
  const managedListings = getManagedListings();
  const seedListingsForBrowse = BROWSE_OWNER_IDS.flatMap((ownerId) => seedListings.findListingsByOwner(ownerId)).filter((listing) => !isListingDeleted(listing.id));
  const listingsById = new Map<string, (typeof seedListingsForBrowse)[number]>();

  for (const listing of seedListingsForBrowse) listingsById.set(listing.id, listing);
  for (const listing of managedListings) if (!isListingDeleted(listing.id)) listingsById.set(listing.id, listing);

  const browseCandidates = [...listingsById.values()].map((listing) => ({ ...listing, distanceMiles: 2, createdAt: new Date('2026-01-01T00:00:00Z') }));
  return applyBrowseFilters(browseCandidates, activeFilters).map((listing) => ({ id: listing.id, title: listing.title, category: listing.category, condition: listing.condition, priceCents: listing.priceCents, image: resolveListingImageSource(listing.images?.[0]?.assetId), href: `/listings/${listing.id}` }));
}

export async function getListingDetail({ listingId }: { listingId: string; viewerId: string | null }): Promise<ListingDetail> {
  const listing = getListingById(listingId);
  if (!listing) { const error = new Error(`Listing not found: ${listingId}`) as Error & { code?: string; listingId?: string }; error.code = 'LISTING_NOT_FOUND'; error.listingId = listingId; throw error; }
  return { id: listing.id, title: listing.title, priceCents: listing.priceCents, description: listing.description, seller: { id: listing.ownerId, displayName: listing.ownerId, profileHref: `/profiles/${listing.ownerId}` }, primaryImage: resolveListingImageSource(listing.images[0]?.assetId), actions: [{ label: 'Post', href: `/signin?callbackUrl=%2Flistings%2F${listing.id}` }] };
}


export async function getRelatedListings({ listingId, limit }: { listingId: string; viewerId: string | null; limit: number }): Promise<Array<{ id: string; href: string }>> {
  const listing = getListingById(listingId);
  if (!listing) return [];
  const related = (getManagedListingsByOwner(listing.ownerId).length > 0 ? getManagedListingsByOwner(listing.ownerId) : seedListings.findListingsByOwner(listing.ownerId)).filter((relatedListing) => relatedListing.id !== listingId);
  return related.slice(0, limit).map((relatedListing) => ({ id: relatedListing.id, href: `/listings/${relatedListing.id}` }));
}

function getManagedListingById(listingId: string) {
  return getManagedListings().find((listing) => listing.id === listingId);
}

function getListingById(listingId: string) {
  if (isListingDeleted(listingId)) return undefined;
  return getManagedListingById(listingId) ?? seedListings.findListingById(listingId);
}

export function createDefaultListingQuery(): ListingFilters { return createDefaultListingFilters(); }

export function parseListingQuery(searchParams: URLSearchParams): ListingFilterState { return createListingFilterState({ search: searchParams.get('search') ?? '', category: searchParams.get('category') ?? '', minPrice: searchParams.get('minPrice') ?? '', maxPrice: searchParams.get('maxPrice') ?? '', maxDistance: searchParams.get('maxDistance') ?? '', condition: searchParams.get('condition') ?? '', sort: (searchParams.get('sort') as ListingSortOption | null) ?? 'relevance' }); }
