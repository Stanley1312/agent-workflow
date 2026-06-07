export type SeedListing = {
  id: string;
  ownerId: string;
  title: string;
  priceCents: number;
  category: string;
  condition: string;
  description: string;
  imageAssetIds: string[];
  images: Array<{
    assetId: string;
  }>;
};

export type SeedProfileReview = {
  id: string;
  profileId: string;
  authorId: string;
  rating: number;
  content: string;
};

export type SeedProfile = {
  id: string;
  userId: string;
  displayName: string;
  listingIds: string[];
  listings: SeedListing[];
  reviews: SeedProfileReview[];
};

type CreateListingInput = Omit<SeedListing, "id" | "imageAssetIds"> & {
  imageAssetIds?: string[];
};
type CreateProfileInput = {
  userId: string;
  displayName: string;
  listingIds: string[];
  reviews: Array<Omit<SeedProfileReview, "id" | "profileId">>;
};
type CreateReviewInput = Omit<SeedProfileReview, "id">;

const listingsById = new Map<string, SeedListing>();
const listingsByOwnerId = new Map<string, SeedListing[]>();
const profilesById = new Map<string, SeedProfile>();
const profilesByUserId = new Map<string, SeedProfile>();

let listingSequence = 0;
let profileSequence = 0;
let reviewSequence = 0;

function createIdentifier(prefix: string, sequence: number): string {
  return `${prefix}-${sequence}`;
}

function addListingToOwner(ownerId: string, listing: SeedListing): void {
  const listings = listingsByOwnerId.get(ownerId) ?? [];
  listings.push(listing);
  listingsByOwnerId.set(ownerId, listings);
}

function createListing(input: CreateListingInput): SeedListing {
  const imageAssetIds = input.imageAssetIds ?? ["product-iphone-13-pro"];
  const listing: SeedListing = {
    id: createIdentifier("listing", ++listingSequence),
    ...input,
    imageAssetIds,
    images: imageAssetIds.map((assetId) => ({ assetId })),
  };

  listingsById.set(listing.id, listing);
  addListingToOwner(input.ownerId, listing);
  return listing;
}

function findListingById(id: string): SeedListing | undefined {
  return listingsById.get(id);
}

function findListingsByOwner(ownerId: string): SeedListing[] {
  return [...(listingsByOwnerId.get(ownerId) ?? [])];
}

function createProfile(input: CreateProfileInput): SeedProfile {
  const profileListings = input.listingIds
    .map((listingId) => listingsById.get(listingId))
    .filter((listing): listing is SeedListing => Boolean(listing));

  const profileReviews = input.reviews.map((review) => ({
    id: createIdentifier("review", ++reviewSequence),
    profileId: createIdentifier("profile", profileSequence + 1),
    ...review,
  }));

  const profile: SeedProfile = {
    id: createIdentifier("profile", ++profileSequence),
    userId: input.userId,
    displayName: input.displayName,
    listingIds: [...input.listingIds],
    listings: profileListings,
    reviews: profileReviews,
  };

  profilesById.set(profile.id, profile);
  profilesByUserId.set(profile.userId, profile);
  return profile;
}

function findProfileById(id: string): SeedProfile {
  const profile = profilesById.get(id);
  if (!profile) {
    throw new Error(`Profile not found: ${id}`);
  }

  return profile;
}

function addReview(input: CreateReviewInput): SeedProfileReview {
  const review: SeedProfileReview = {
    id: createIdentifier("review", ++reviewSequence),
    ...input,
  };

  const profile = profilesById.get(input.profileId);
  if (!profile) {
    throw new Error(`Profile not found: ${input.profileId}`);
  }

  profile.reviews = [...profile.reviews, review];
  return review;
}

export const seedListings = {
  createListing,
  findListingById,
  findListingsByOwner,
  createProfile,
  findProfileById,
  addReview,
};

// Baseline seeded data to satisfy current persistence contract.
const ownerAveryListingOne = createListing({
  ownerId: "owner-avery",
  title: "Canon EOS Camera",
  priceCents: 84_900,
  category: "electronics",
  condition: "used",
  description: "Mirrorless camera body with lens and charger.",
  imageAssetIds: ["listing-camera-1"],
});
createListing({
  ownerId: "owner-avery",
  title: "Vintage Leather Sofa",
  priceCents: 61_500,
  category: "home",
  condition: "used",
  description: "Three-seat sofa with solid frame and warm brown leather.",
  imageAssetIds: ["product-sofa-vintage"],
});
createListing({
  ownerId: "owner-jordan",
  title: "Sony WH-1000XM5",
  priceCents: 27_900,
  category: "electronics",
  condition: "used",
  description: "Noise-canceling headphones with case and cable.",
  imageAssetIds: ["product-sony-wh1000xm5"],
});
const missingImageListing: SeedListing = {
  id: "listing-missing-image",
  ownerId: "owner-jordan",
  title: "Listing with missing image",
  priceCents: 19_900,
  category: "electronics",
  condition: "used",
  description: "Seeded listing used to verify fallback imagery.",
  imageAssetIds: ["missing-product-asset"],
  images: [{ assetId: "missing-product-asset" }],
};
listingsById.set(missingImageListing.id, missingImageListing);
addListingToOwner(missingImageListing.ownerId, missingImageListing);
profilesById.set("profile-empty-state", {
  id: "profile-empty-state",
  userId: "profile-empty-state-user",
  displayName: "Empty Profile",
  listingIds: [],
  listings: [],
  reviews: [],
});
profilesByUserId.set("profile-empty-state-user", profilesById.get("profile-empty-state")!);
profilesById.set("owner-avery", {
  id: "owner-avery",
  userId: "owner-avery",
  displayName: "Avery Stone",
  listingIds: [ownerAveryListingOne.id],
  listings: [ownerAveryListingOne, ...findListingsByOwner("owner-avery").slice(1)],
  reviews: [],
});
profilesByUserId.set("owner-avery", profilesById.get("owner-avery")!);
profilesById.set("owner-jordan", {
  id: "owner-jordan",
  userId: "owner-jordan",
  displayName: "Jordan Lee",
  listingIds: [findListingById("listing-3")?.id ?? "listing-3"],
  listings: [findListingById("listing-3") ?? createListing({
    ownerId: "owner-jordan",
    title: "Sony WH-1000XM5",
    priceCents: 27_900,
    category: "electronics",
    condition: "used",
    description: "Noise-canceling headphones with case and cable.",
    imageAssetIds: ["product-sony-wh1000xm5"],
  })],
  reviews: [],
});
profilesByUserId.set("owner-jordan", profilesById.get("owner-jordan")!);
