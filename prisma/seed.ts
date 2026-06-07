import { seedListings, seedProfiles, seedReviews, seedUsers } from "../src/data/seed-listings";
import { productAssets } from "../src/data/product-assets";
import { getProductImageSourceMap } from "../src/lib/assets";

type SeedUserRecord = {
  id: string;
  email: string;
  displayName: string;
};

type SeedListingRecord = {
  id: string;
  ownerId: string;
  title: string;
  priceCents: number;
  category: string;
  condition: string;
  description: string;
};

type SeedListingImageRecord = {
  listingId: string;
  assetId: string;
  src: string;
};

type SeedProfileRecord = {
  id: string;
  userId: string;
  displayName: string;
};

type SeedReviewRecord = {
  profileId: string;
  authorId: string;
  rating: number;
  content: string;
};

const DEFAULT_START_ID = 1;

function createId(prefix: string, sequence: number): string {
  return `${prefix}-${sequence}`;
}

export async function seed(): Promise<void> {
  const imageSourceByAssetId = getProductImageSourceMap();
  const usersByKey = new Map<string, SeedUserRecord>();
  const listingsByTitle = new Map<string, SeedListingRecord>();
  const profilesByKey = new Map<string, SeedProfileRecord>();

  seedUsers.forEach((user, index) => {
    const record = {
      id: createId("user", DEFAULT_START_ID + index),
      email: user.email,
      displayName: user.displayName,
    };
    usersByKey.set(user.key, record);
  });

  const listingRecords: SeedListingRecord[] = seedListings.map((listing, index) => {
    const owner = usersByKey.get(listing.ownerKey);
    if (!owner) {
      throw new Error(`Missing seed user for listing owner: ${listing.ownerKey}`);
    }

    const record = {
      id: createId("listing", DEFAULT_START_ID + index),
      ownerId: owner.id,
      title: listing.title,
      priceCents: listing.priceCents,
      category: listing.category,
      condition: listing.condition,
      description: listing.description,
    };

    listingsByTitle.set(listing.title, record);
    return record;
  });

  const listingImageRecords: SeedListingImageRecord[] = seedListings.flatMap((listing) => {
    const persistedListing = listingsByTitle.get(listing.title);
    if (!persistedListing) {
      throw new Error(`Missing seed listing for title: ${listing.title}`);
    }

    return listing.imageAssetIds.map((assetId) => {
      const src = imageSourceByAssetId[assetId];
      if (!src) {
        throw new Error(`Missing product asset for asset id: ${assetId}`);
      }

      return {
        listingId: persistedListing.id,
        assetId,
        src,
      };
    });
  });

  seedProfiles.forEach((profile, index) => {
    const user = usersByKey.get(profile.userKey);
    if (!user) {
      throw new Error(`Missing seed user for profile: ${profile.userKey}`);
    }

    profilesByKey.set(profile.userKey, {
      id: createId("profile", DEFAULT_START_ID + index),
      userId: user.id,
      displayName: profile.displayName,
    });
  });

  const reviewRecords: SeedReviewRecord[] = seedReviews.map((review) => {
    const profile = profilesByKey.get(review.profileKey);
    const author = usersByKey.get(review.authorKey);
    if (!profile || !author) {
      throw new Error(`Missing seed relation for review: ${review.profileKey}`);
    }

    return {
      profileId: profile.id,
      authorId: author.id,
      rating: review.rating,
      content: review.content,
    };
  });

  void productAssets;
  void listingRecords;
  void listingImageRecords;
  void reviewRecords;
}

void seed();
