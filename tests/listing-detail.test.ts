import { describe, expect, it } from "vitest";

describe("listing detail", () => {
  it("should show listing imagery title price description seller linkage and visible actions when a user selects a listing", async () => {
    const { getBrowseListings, getListingDetail } = await import("../src/lib/listings/queries");

    const [selectedListing] = await getBrowseListings({
      viewerId: null,
      filters: {
        search: "camera",
      },
    });

    expect(selectedListing).toBeDefined();

    const detail = await getListingDetail({
      listingId: selectedListing.id,
      viewerId: null,
    });

    expect(detail).toMatchObject({
      id: selectedListing.id,
      title: expect.any(String),
      priceCents: expect.any(Number),
      description: expect.any(String),
      seller: {
        id: expect.any(String),
        displayName: expect.any(String),
        profileHref: expect.stringMatching(/^\/profiles\//),
      },
      primaryImage: {
        src: expect.any(String),
        alt: expect.any(String),
      },
      actions: expect.arrayContaining([
        expect.objectContaining({ label: expect.any(String) }),
      ]),
    });
  });

  it("should render a stable fallback image when the listing detail image asset is unavailable", async () => {
    const { getListingDetail } = await import("../src/lib/listings/queries");

    const detail = await getListingDetail({
      listingId: "listing-missing-image",
      viewerId: null,
    });

    expect(detail.primaryImage).toEqual({
      src: "/images/products/fallback.svg",
      alt: "Marketplace listing image unavailable",
    });
  });

  it("should render a safe not-found state when an unknown listing id is opened directly", async () => {
    const { getListingDetail } = await import("../src/lib/listings/queries");

    await expect(
      getListingDetail({
        listingId: "listing-does-not-exist",
        viewerId: null,
      }),
    ).rejects.toMatchObject({
      code: "LISTING_NOT_FOUND",
      listingId: "listing-does-not-exist",
    });
  });

  it("should open the seller profile when the visible seller linkage is selected on listing detail", async () => {
    const { getBrowseListings } = await import("../src/lib/listings/queries");
    const { getListingDetailNavigation } = await import("../src/app/listings/[id]/page");

    const [selectedListing] = await getBrowseListings({
      viewerId: null,
      filters: {
        search: "camera",
      },
    });

    expect(selectedListing).toBeDefined();

    const navigation = await getListingDetailNavigation({
      listingId: selectedListing.id,
      viewerId: null,
    });

    expect(navigation.sellerProfileHref).toMatch(/^\/profiles\//);
  });

  it("should move to a represented destination without losing app state when a visible related listing is selected", async () => {
    const { getBrowseListings, getRelatedListings } = await import("../src/lib/listings/queries");

    const [selectedListing] = await getBrowseListings({
      viewerId: null,
      filters: {
        search: "camera",
      },
    });

    expect(selectedListing).toBeDefined();

    const relatedListings = await getRelatedListings({
      listingId: selectedListing.id,
      viewerId: null,
      limit: 3,
    });

    expect(relatedListings.length).toBeGreaterThan(0);
    expect(relatedListings[0]).toMatchObject({
      id: expect.any(String),
      href: expect.stringMatching(/^\/listings\//),
    });
    expect(relatedListings.every((listing) => listing.id !== selectedListing.id)).toBe(true);
  });
});
