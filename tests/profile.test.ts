import { describe, expect, it } from "vitest";

describe("profile views and navigation", () => {
  it("should render profile information tabs listings rating summary and reviews when a user opens a visible profile", async () => {
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const profile = await getProfilePageData({
      profileId: "owner-avery",
      viewerId: null,
    });

    expect(profile).toMatchObject({
      profile: {
        id: "owner-avery",
        displayName: expect.any(String),
        locationLabel: expect.any(String),
        memberSinceLabel: expect.any(String),
      },
      tabs: expect.arrayContaining([
        expect.objectContaining({ key: "listings", label: expect.any(String) }),
        expect.objectContaining({ key: "reviews", label: expect.any(String) }),
      ]),
      listings: expect.any(Array),
      ratingSummary: {
        averageRating: expect.any(Number),
        reviewCount: expect.any(Number),
      },
      reviews: expect.any(Array),
    });
  });

  it("should show stable empty states when the selected profile has no listings and no reviews", async () => {
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const profile = await getProfilePageData({
      profileId: "profile-empty-state",
      viewerId: null,
    });

    expect(profile.listings).toEqual([]);
    expect(profile.reviews).toEqual([]);
    expect(profile.ratingSummary).toEqual({
      averageRating: 0,
      reviewCount: 0,
    });
    expect(profile.emptyStates).toMatchObject({
      listings: expect.objectContaining({
        title: expect.any(String),
      }),
      reviews: expect.objectContaining({
        title: expect.any(String),
      }),
    });
  });

  it("should activate the requested profile tab and return the matching section content when a visible tab is selected", async () => {
    const { getProfileTabView } = await import("../src/app/profiles/[id]/page");

    const tabView = await getProfileTabView({
      profileId: "owner-avery",
      viewerId: null,
      activeTab: "reviews",
    });

    expect(tabView).toMatchObject({
      activeTab: "reviews",
      tabs: expect.arrayContaining([
        expect.objectContaining({ key: "reviews", isActive: true }),
        expect.objectContaining({ key: "listings", isActive: false }),
      ]),
      section: {
        key: "reviews",
        items: expect.any(Array),
      },
    });
  });

  it("should open the represented seller profile destination when seller linkage is used from listing detail", async () => {
    const { getListingDetailNavigation } = await import("../src/app/listings/[id]/page");
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const navigation = await getListingDetailNavigation({
      listingId: "listing-1",
      viewerId: null,
    });

    expect(navigation.sellerProfileHref).toMatch(/^\/profiles\//);

    const profileId = navigation.sellerProfileHref.split("/").at(-1);
    const profile = await getProfilePageData({
      profileId: profileId ?? "",
      viewerId: null,
    });

    expect(profile.profile.id).toBe(profileId);
  });

  it("should expose a safe represented profile action when the owner opens their own profile", async () => {
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const profile = await getProfilePageData({
      profileId: "owner-avery",
      viewerId: "owner-avery",
    });

    expect(profile.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: expect.any(String),
          href: expect.stringMatching(/^\/profiles\/owner-avery/),
        }),
      ]),
    );
  });
});
