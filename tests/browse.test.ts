import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("browse marketplace listings", () => {
  it("should render the browse marketplace entry point with navigation listing cards imagery and visible controls when a visitor opens the app", async () => {
    const { default: BrowsePage } = await import("../src/app/page");

    expect(BrowsePage).toBeDefined();

    const markup = renderToStaticMarkup(BrowsePage());

    expect(markup).toContain("Listings");
    expect(markup).toContain("Showing 1-4 of 24 results");
    expect(markup).toContain("Previous");
    expect(markup).toContain("Next");
  });

  it("should update browse results when visible search filter category and sort controls are applied", async () => {
    const { applyBrowseFilters } = await import("../src/lib/listings/filters");
    const { getBrowseListings } = await import("../src/lib/listings/queries");

    const listings = await getBrowseListings({
      viewerId: null,
      filters: {},
    });
    const filteredListings = applyBrowseFilters(listings, {
      search: "sofa",
      category: "home",
      condition: "used",
      sort: "price-asc",
    });

    expect(filteredListings.length).toBeGreaterThan(0);
    expect(filteredListings.every((listing) => listing.category === "home")).toBe(true);
    expect(filteredListings.every((listing) => listing.condition === "used")).toBe(true);
    expect(filteredListings[0]?.title.toLowerCase()).toContain("sofa");
  });

  it("should show an empty state when no browse listings match the selected filters", async () => {
    const { getBrowseListings } = await import("../src/lib/listings/queries");

    const listings = await getBrowseListings({
      viewerId: null,
      filters: {
        search: "listing-that-does-not-exist",
        category: "home",
      },
    });

    expect(listings).toEqual([]);
  });

  it("should restore the default browse listing set when active filters are cleared", async () => {
    const { applyBrowseFilters, clearBrowseFilters } = await import("../src/lib/listings/filters");
    const { getBrowseListings } = await import("../src/lib/listings/queries");

    const defaultListings = await getBrowseListings({
      viewerId: null,
      filters: {},
    });
    const activeFilters = {
      category: "electronics",
      search: "camera",
    };
    const filteredListings = applyBrowseFilters(defaultListings, activeFilters);
    const clearedFilters = clearBrowseFilters(activeFilters);
    const restoredListings = applyBrowseFilters(defaultListings, clearedFilters);

    expect(filteredListings.length).toBeLessThanOrEqual(defaultListings.length);
    expect(restoredListings).toEqual(defaultListings);
  });

  it("should require authentication when a visitor activates a protected create listing action from browse navigation", async () => {
    const { getPrimaryNavigationActions } = await import("../src/components/navigation/global-nav");

    const actions = await getPrimaryNavigationActions({
      session: null,
      pathname: "/",
    });

    expect(actions).toContainEqual({
      label: "Post",
      href: "/signin?callbackUrl=%2Flistings%2Fnew",
      requiresAuthentication: true,
    });
  });
});
