import { describe, expect, it } from "vitest";

describe("listing management", () => {
  it("should require authentication before a visitor can open the create listing flow", async () => {
    const { getCreateListingPageGuard } = await import("../src/app/listings/new/page");

    await expect(
      getCreateListingPageGuard({
        session: null,
      }),
    ).rejects.toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
      redirectTo: "/signin?callbackUrl=%2Flistings%2Fnew",
    });
  });

  it("should create a listing with valid visible fields and show it in browse detail and profile views", async () => {
    const { createListingAction } = await import("../src/app/listings/actions");
    const { getBrowseListings, getListingDetail } = await import("../src/lib/listings/queries");
    const { getProfileListings } = await import("../src/lib/profiles/queries");

    const createdListing = await createListingAction({
      session: {
        user: {
          id: "owner-avery",
          name: "Avery",
          email: "avery@example.com",
        },
      },
      input: {
        title: "Walnut side table",
        priceCents: 12500,
        category: "home",
        condition: "used",
        description: "Solid wood side table with a clean finish.",
      },
    });

    expect(createdListing).toMatchObject({
      id: expect.any(String),
      ownerId: "owner-avery",
      title: "Walnut side table",
      priceCents: 12500,
      category: "home",
      condition: "used",
      description: "Solid wood side table with a clean finish.",
      image: {
        src: expect.any(String),
        alt: expect.any(String),
      },
    });

    await expect(
      getListingDetail({
        listingId: createdListing.id,
        viewerId: null,
      }),
    ).resolves.toMatchObject({
      id: createdListing.id,
      title: "Walnut side table",
    });

    await expect(
      getBrowseListings({
        viewerId: null,
        filters: { search: "Walnut side table" },
      }),
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdListing.id,
          title: "Walnut side table",
        }),
      ]),
    );

    await expect(getProfileListings({ profileId: "owner-avery" })).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdListing.id,
          title: "Walnut side table",
        }),
      ]),
    );
  });

  it("should reject invalid listing data during create with field-level validation errors and preserve browse results", async () => {
    const { createListingAction } = await import("../src/app/listings/actions");
    const { getBrowseListings } = await import("../src/lib/listings/queries");

    const beforeListings = await getBrowseListings({
      viewerId: null,
      filters: {},
    });

    await expect(
      createListingAction({
        session: {
          user: {
            id: "owner-avery",
            name: "Avery",
            email: "avery@example.com",
          },
        },
        input: {
          title: "",
          priceCents: 0,
          category: "",
          condition: "used",
          description: "",
          imageAssetIds: ["unsupported-hidden-image-reference"],
        },
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: {
        title: expect.any(Array),
        priceCents: expect.any(Array),
        category: expect.any(Array),
        description: expect.any(Array),
        imageAssetIds: expect.any(Array),
      },
    });

    await expect(
      getBrowseListings({
        viewerId: null,
        filters: {},
      }),
    ).resolves.toEqual(beforeListings);
  });

  it("should accept minimum valid boundary values when an owner creates a listing without an explicit image input", async () => {
    const { createListingAction } = await import("../src/app/listings/actions");
    const { getListingDetail } = await import("../src/lib/listings/queries");

    const createdListing = await createListingAction({
      session: {
        user: {
          id: "owner-jordan",
          name: "Jordan",
          email: "jordan@example.com",
        },
      },
      input: {
        title: "Chair",
        priceCents: 100,
        category: "home",
        condition: "used",
        description: "Solid chair.",
      },
    });

    expect(createdListing).toMatchObject({
      title: "Chair",
      priceCents: 100,
    });

    await expect(
      getListingDetail({
        listingId: createdListing.id,
        viewerId: "owner-jordan",
      }),
    ).resolves.toMatchObject({
      id: createdListing.id,
      primaryImage: {
        src: expect.any(String),
        alt: expect.any(String),
      },
    });
  });

  it("should show owner-only controls and persist valid listing edits across detail browse and profile views", async () => {
    const { getListingOwnerControls } = await import("../src/components/listings/owner-controls");
    const { updateListingAction } = await import("../src/app/listings/actions");
    const { getListingDetail, getBrowseListings } = await import("../src/lib/listings/queries");
    const { getProfileListings } = await import("../src/lib/profiles/queries");

    const controls = await getListingOwnerControls({
      session: {
        user: {
          id: "owner-avery",
          name: "Avery",
          email: "avery@example.com",
        },
      },
      listingId: "listing-1",
    });

    expect(controls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Edit", href: "/listings/listing-1/edit" }),
        expect.objectContaining({ label: "Delete" }),
      ]),
    );

    const updatedListing = await updateListingAction({
      session: {
        user: {
          id: "owner-avery",
          name: "Avery",
          email: "avery@example.com",
        },
      },
      listingId: "listing-1",
      input: {
        title: "Canon EOS Camera Mark II",
        priceCents: 89900,
        category: "electronics",
        condition: "used",
        description: "Updated mirrorless camera bundle with charger and lens.",
      },
    });

    expect(updatedListing).toMatchObject({
      id: "listing-1",
      title: "Canon EOS Camera Mark II",
      priceCents: 89900,
    });

    await expect(
      getListingDetail({
        listingId: "listing-1",
        viewerId: "owner-avery",
      }),
    ).resolves.toMatchObject({
      title: "Canon EOS Camera Mark II",
      priceCents: 89900,
      description: "Updated mirrorless camera bundle with charger and lens.",
    });

    await expect(
      getBrowseListings({
        viewerId: null,
        filters: { search: "Mark II" },
      }),
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "listing-1",
          title: "Canon EOS Camera Mark II",
        }),
      ]),
    );

    await expect(getProfileListings({ profileId: "owner-avery" })).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "listing-1",
          title: "Canon EOS Camera Mark II",
        }),
      ]),
    );
  });

  it("should reject invalid listing edits and keep the last valid listing data unchanged", async () => {
    const { updateListingAction } = await import("../src/app/listings/actions");
    const { getListingDetail } = await import("../src/lib/listings/queries");

    const beforeDetail = await getListingDetail({
      listingId: "listing-1",
      viewerId: "owner-avery",
    });

    await expect(
      updateListingAction({
        session: {
          user: {
            id: "owner-avery",
            name: "Avery",
            email: "avery@example.com",
          },
        },
        listingId: "listing-1",
        input: {
          title: "",
          priceCents: 0,
          category: "",
          condition: "used",
          description: "",
        },
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: {
        title: expect.any(Array),
        priceCents: expect.any(Array),
        category: expect.any(Array),
        description: expect.any(Array),
      },
    });

    await expect(
      getListingDetail({
        listingId: "listing-1",
        viewerId: "owner-avery",
      }),
    ).resolves.toEqual(beforeDetail);
  });

  it("should deny edit and delete actions for an authenticated non-owner and leave the listing unchanged", async () => {
    const { updateListingAction, deleteListingAction } = await import("../src/app/listings/actions");
    const { getListingDetail } = await import("../src/lib/listings/queries");

    const beforeDetail = await getListingDetail({
      listingId: "listing-1",
      viewerId: "owner-avery",
    });

    await expect(
      updateListingAction({
        session: {
          user: {
            id: "user-non-owner",
            name: "Viewer",
            email: "viewer@example.com",
          },
        },
        listingId: "listing-1",
        input: {
          title: "Hijacked camera listing",
          priceCents: 1,
          category: "electronics",
          condition: "used",
          description: "Unauthorized edit attempt.",
        },
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      listingId: "listing-1",
      action: "edit-listing",
    });

    await expect(
      deleteListingAction({
        session: {
          user: {
            id: "user-non-owner",
            name: "Viewer",
            email: "viewer@example.com",
          },
        },
        listingId: "listing-1",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      listingId: "listing-1",
      action: "delete-listing",
    });

    await expect(
      getListingDetail({
        listingId: "listing-1",
        viewerId: "owner-avery",
      }),
    ).resolves.toEqual(beforeDetail);
  });

  it("should delete an owned listing remove it from browse detail and profile views and return a safe not-found state on direct access", async () => {
    const { deleteListingAction } = await import("../src/app/listings/actions");
    const { getBrowseListings, getListingDetail } = await import("../src/lib/listings/queries");
    const { getProfileListings } = await import("../src/lib/profiles/queries");

    await expect(
      deleteListingAction({
        session: {
          user: {
            id: "owner-jordan",
            name: "Jordan",
            email: "jordan@example.com",
          },
        },
        listingId: "listing-3",
        confirm: true,
      }),
    ).resolves.toMatchObject({
      deletedListingId: "listing-3",
      redirectTo: expect.stringMatching(/^\/(|profiles\/.*)$/),
    });

    await expect(
      getBrowseListings({
        viewerId: null,
        filters: { search: "Sony WH-1000XM5" },
      }),
    ).resolves.toEqual([]);

    await expect(getProfileListings({ profileId: "owner-jordan" })).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "listing-3" }),
      ]),
    );

    await expect(
      getListingDetail({
        listingId: "listing-3",
        viewerId: "owner-jordan",
      }),
    ).rejects.toMatchObject({
      code: "LISTING_NOT_FOUND",
      listingId: "listing-3",
    });
  });
});
