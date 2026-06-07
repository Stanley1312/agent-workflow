import { describe, expect, it } from "vitest";

describe("listing persistence", () => {
  it("should persist a valid new listing when required marketplace fields are provided without requiring a user-supplied image", async () => {
    const { seedListings } = await import("../src/data/seed-listings");
    const { resolveListingImageSource } = await import("../src/lib/assets");
    const ownerId = "user-owner-1";
    const listing = seedListings.createListing({
      ownerId,
      title: "Minimalist desk lamp",
      priceCents: 4500,
      category: "home",
      condition: "used",
      description: "Warm desk lamp in working condition.",
    });

    expect(listing).toMatchObject({
      ownerId,
      title: "Minimalist desk lamp",
      priceCents: 4500,
      category: "home",
      condition: "used",
      description: "Warm desk lamp in working condition.",
    });
    expect(listing.id).toEqual(expect.any(String));
    expect(listing.images.length).toBeGreaterThan(0);

    const imageSource = resolveListingImageSource(listing.images[0]?.assetId ?? null);

    expect(imageSource).toMatchObject({
      src: expect.any(String),
      alt: expect.any(String),
    });
    expect(seedListings.findListingById(listing.id)).toEqual(listing);
  });

  it("should keep profile listing views consistent when a saved listing belongs to the profile owner", async () => {
    const { seedListings } = await import("../src/data/seed-listings");
    const ownerId = "user-profile-owner";
    const listing = seedListings.createListing({
      ownerId,
      title: "Profile visible bicycle",
      priceCents: 12000,
      category: "sports",
      condition: "used",
      description: "Road-ready bicycle for local pickup.",
      imageAssetIds: ["product-bicycle"],
    });

    const profileListings = seedListings.findListingsByOwner(ownerId);

    expect(profileListings).toContainEqual(listing);
  });

  it("should render stable profile empty states when the profile has no listings and no reviews", async () => {
    const { seedListings } = await import("../src/data/seed-listings");
    const { calculateRatingSummary } = await import("../src/lib/ratings");
    const profile = seedListings.createProfile({
      userId: "user-empty-profile",
      displayName: "Empty Seller",
      listingIds: [],
      reviews: [],
    });

    expect(profile.listings).toEqual([]);
    expect(profile.reviews).toEqual([]);
    expect(calculateRatingSummary(profile.reviews)).toEqual({
      averageRating: 0,
      reviewCount: 0,
    });
  });

  it("should persist a valid review and update the profile rating summary when review input is permitted", async () => {
    const { seedListings } = await import("../src/data/seed-listings");
    const { calculateRatingSummary } = await import("../src/lib/ratings");
    const profile = seedListings.createProfile({
      userId: "user-reviewed-profile",
      displayName: "Reviewed Seller",
      listingIds: [],
      reviews: [],
    });

    const review = seedListings.addReview({
      profileId: profile.id,
      authorId: "user-review-author",
      rating: 5,
      content: "Fast pickup and the item matched the listing.",
    });

    const updatedProfile = seedListings.findProfileById(profile.id);

    expect(updatedProfile.reviews).toContainEqual(review);
    expect(calculateRatingSummary(updatedProfile.reviews)).toEqual({
      averageRating: 5,
      reviewCount: 1,
    });
  });

  it("should use a stable fallback image reference when listing image assets are unavailable", async () => {
    const { resolveListingImageSource } = await import("../src/lib/assets");
    const imageSource = resolveListingImageSource("missing-product-asset");

    expect(imageSource).toEqual({
      src: "/images/products/fallback.svg",
      alt: "Marketplace listing image unavailable",
    });
  });
});
