import { seedListings, type SeedListing } from '../../data/seed-listings';
import { assertListingOwnership } from './authorization';
import { listingInputSchema, type ListingInput } from '../validation/listing';
import { resolveListingImageSource } from '../assets';

export type ListingMutationInput = ListingInput;

export type CreateListingArgs = {
  ownerId: string;
  input: ListingMutationInput;
};

export type UpdateListingArgs = {
  listingId: string;
  ownerId: string;
  input: ListingMutationInput;
};

export type DeleteListingArgs = {
  listingId: string;
  ownerId: string;
};

const listingsById = new Map<string, SeedListing>();
const deletedListingIds = new Set<string>();
let nextListingSequence = 1000;

function createListingId(): string {
  const listingId = `listing-${nextListingSequence}`;
  nextListingSequence += 1;
  return listingId;
}

function cloneListing(listing: SeedListing): SeedListing {
  return { ...listing, imageAssetIds: [...listing.imageAssetIds], images: listing.images.map((image) => ({ ...image })) };
}

function ensureListing(listingId: string): SeedListing | undefined {
  if (deletedListingIds.has(listingId)) return undefined;

  const existingListing = listingsById.get(listingId);
  if (existingListing) return existingListing;

  const seedListing = seedListings.findListingById(listingId);
  if (!seedListing) return undefined;

  const clonedListing = cloneListing(seedListing);
  listingsById.set(listingId, clonedListing);
  return clonedListing;
}

function getExistingListing(listingId: string): SeedListing | undefined {
  return deletedListingIds.has(listingId) ? undefined : listingsById.get(listingId);
}

function ensureManagedListing(listingId: string): SeedListing | undefined {
  const existingListing = getExistingListing(listingId);
  if (existingListing) return existingListing;

  const seedListing = seedListings.findListingById(listingId);
  if (!seedListing) return undefined;

  const clonedListing = cloneListing(seedListing);
  listingsById.set(listingId, clonedListing);
  return clonedListing;
}

function persistListing(listing: SeedListing): SeedListing {
  listingsById.set(listing.id, listing);
  return listing;
}

export function validateListingInput(input: ListingMutationInput): ListingMutationInput {
  return listingInputSchema.parse(input);
}

export function createListing(args: CreateListingArgs): SeedListing {
  const validatedInput = validateListingInput(args.input);
  return persistListing({
    id: createListingId(),
    ownerId: args.ownerId,
    title: validatedInput.title,
    priceCents: validatedInput.priceCents,
    category: validatedInput.category,
    condition: validatedInput.condition,
    description: validatedInput.description,
    imageAssetIds: validatedInput.imageAssetIds ?? [],
    images: (validatedInput.imageAssetIds ?? []).map((assetId) => ({ assetId })),
  });
}

export function updateListing(args: UpdateListingArgs): SeedListing {
  const listing = ensureManagedListing(args.listingId);
  if (!listing) throw new Error('LISTING_NOT_FOUND');

  const session = { user: { id: args.ownerId, name: '', email: '' } } as never;
  assertListingOwnership(session, listing);

  const validatedInput = validateListingInput(args.input);
  const imageAssetIds = validatedInput.imageAssetIds ?? listing.imageAssetIds;
  return persistListing({
    ...listing,
    title: validatedInput.title,
    priceCents: validatedInput.priceCents,
    category: validatedInput.category,
    condition: validatedInput.condition,
    description: validatedInput.description,
    imageAssetIds,
    images: imageAssetIds.map((assetId) => ({ assetId })),
  });
}

export function deleteListing(args: DeleteListingArgs): void {
  const listing = ensureManagedListing(args.listingId);
  if (!listing) throw new Error('LISTING_NOT_FOUND');

  const session = { user: { id: args.ownerId, name: '', email: '' } } as never;
  assertListingOwnership(session, listing);

  listingsById.delete(args.listingId);
  deletedListingIds.add(args.listingId);
}

export function findManagedListing(listingId: string): SeedListing | undefined {
  return deletedListingIds.has(listingId) ? undefined : listingsById.get(listingId) ?? ensureManagedListing(listingId);
}

export function isListingDeleted(listingId: string): boolean {
  return deletedListingIds.has(listingId);
}

export function getManagedListings(): SeedListing[] {
  return [...listingsById.values()];
}

export function getManagedListingsByOwner(ownerId: string): SeedListing[] {
  return getManagedListings().filter((listing) => listing.ownerId === ownerId);
}


export function getListingImageSource(listing: SeedListing | undefined): { src: string; alt: string } {
  return resolveListingImageSource(listing?.images[0]?.assetId);
}
