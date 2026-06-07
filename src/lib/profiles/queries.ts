import { calculateRatingSummary, createEmptyRatingAggregate, type RatingAggregate } from '../ratings';
import { getManagedListingsByOwner, isListingDeleted } from '../listings/mutations';
import { getProfileReviews as getStoredProfileReviews } from '../reviews/mutations';
import { seedListings, type SeedProfile, type SeedProfileReview } from '../../data/seed-listings';

export type ProfileListing = {
  id: string;
  title: string;
  priceCents: number;
  category: string;
  condition: string;
  description: string;
};

export type ProfileReview = {
  id: string;
  authorId: string;
  rating: number;
  content: string;
};

export type ProfileSummary = {
  id: string;
  userId: string;
  displayName: string;
  listingCount: number;
  reviewCount: number;
  ratingSummary: RatingAggregate;
};

export type ProfilePageData = {
  profile: {
    id: string;
    displayName: string;
    locationLabel: string;
    memberSinceLabel: string;
  };
  tabs: Array<{ key: string; label: string; isActive?: boolean }>;
  listings: ProfileListing[];
  reviews: ProfileReview[];
  ratingSummary: RatingAggregate;
  emptyStates: {
    listings: { title: string; description: string };
    reviews: { title: string; description: string };
  };
  actions: Array<{ label: string; href: string }>;
  summary: ProfileSummary;
};

function mapListing(listing: { id: string; title: string; priceCents: number; category: string; condition: string; description: string }): ProfileListing {
  return { id: listing.id, title: listing.title, priceCents: listing.priceCents, category: listing.category, condition: listing.condition, description: listing.description };
}

function mapReview(review: SeedProfileReview): ProfileReview {
  return { id: review.id, authorId: review.authorId, rating: review.rating, content: review.content };
}

function isSeedReview(review: SeedProfileReview | ProfileReview): review is SeedProfileReview {
  return 'authorId' in review;
}

export function getProfileById(profileId: string): SeedProfile {
  return seedListings.findProfileById(profileId);
}

export async function getProfileListings({ profileId }: { profileId: string }): Promise<ProfileListing[]> {
  const profile = getProfileById(profileId);
  const seedListingsForProfile = profile.listings.filter((listing) => !isListingDeleted(listing.id)).map(mapListing);
  const managedListings = getManagedListingsByOwner(profileId).filter((listing) => !isListingDeleted(listing.id)).map(mapListing);

  if (managedListings.length === 0) return seedListingsForProfile;

  const listingsById = new Map<string, ProfileListing>();
  for (const listing of seedListingsForProfile) listingsById.set(listing.id, listing);
  for (const listing of managedListings) listingsById.set(listing.id, listing);

  return [...listingsById.values()];
}

export function getProfileReviews(profileId: string): ProfileReview[] {
  const seedReviews = getProfileById(profileId).reviews.map(mapReview);
  const storedReviews = getStoredProfileReviews(profileId).filter(isSeedReview).map(mapReview);
  return [...seedReviews, ...storedReviews];
}

export function getProfileRatingSummary(profileId: string): RatingAggregate {
  const reviews = getProfileReviews(profileId);
  return reviews.length === 0 ? createEmptyRatingAggregate() : calculateRatingSummary(reviews);
}

export async function getProfilePageData({ profileId, viewerId }: { profileId: string; viewerId: string | null }): Promise<ProfilePageData> {
  const profile = getProfileById(profileId);
  const listings = await getProfileListings({ profileId });
  const reviews = getProfileReviews(profileId);
  const ratingSummary = getProfileRatingSummary(profileId);
  const isOwnProfile = viewerId === profile.userId;

  return {
    profile: {
      id: profile.id,
      displayName: profile.displayName,
      locationLabel: 'Local marketplace',
      memberSinceLabel: 'Member since 2024',
    },
    tabs: [
      { key: 'listings', label: 'Listings', isActive: true },
      { key: 'reviews', label: 'Reviews', isActive: false },
    ],
    listings,
    reviews,
    ratingSummary,
    emptyStates: {
      listings: { title: 'No listings yet', description: 'This profile has not posted any listings.' },
      reviews: { title: 'No reviews yet', description: 'This profile has not received any reviews.' },
    },
    actions: isOwnProfile ? [{ label: 'Edit profile', href: `/profiles/${profile.id}/edit` }] : [{ label: 'Message seller', href: `/messages/new` }],
    summary: {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      listingCount: listings.length,
      reviewCount: reviews.length,
      ratingSummary,
    },
  };
}
