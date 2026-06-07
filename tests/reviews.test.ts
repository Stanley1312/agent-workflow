import { describe, expect, it } from "vitest";

describe("profile reviews and ratings", () => {
  it("should persist a valid review and update the profile rating summary when permitted review input is submitted", async () => {
    const { createReviewAction } = await import("../src/app/profiles/[id]/actions");
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const beforeProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-1",
    });

    const createdReview = await createReviewAction({
      session: {
        user: {
          id: "user-reviewer-1",
          name: "Taylor",
          email: "taylor@example.com",
        },
      },
      profileId: "owner-jordan",
      input: {
        rating: 5,
        content: "Great communication and an easy pickup.",
      },
    });

    expect(createdReview).toMatchObject({
      id: expect.any(String),
      profileId: "owner-jordan",
      authorId: "user-reviewer-1",
      rating: 5,
      content: "Great communication and an easy pickup.",
    });

    const afterProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-1",
    });

    expect(afterProfile.reviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdReview.id,
          rating: 5,
          content: "Great communication and an easy pickup.",
        }),
      ]),
    );
    expect(afterProfile.ratingSummary.reviewCount).toBe(beforeProfile.ratingSummary.reviewCount + 1);
    expect(afterProfile.ratingSummary.averageRating).toBeGreaterThanOrEqual(0);
    expect(afterProfile.ratingSummary.averageRating).toBeLessThanOrEqual(5);
  });

  it("should reject a review when the rating is outside the allowed range and keep the aggregate unchanged", async () => {
    const { createReviewAction } = await import("../src/app/profiles/[id]/actions");
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const beforeProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-2",
    });

    await expect(
      createReviewAction({
        session: {
          user: {
            id: "user-reviewer-2",
            name: "Morgan",
            email: "morgan@example.com",
          },
        },
        profileId: "owner-jordan",
        input: {
          rating: 6,
          content: "Invalid rating should not save.",
        },
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: {
        rating: expect.any(Array),
      },
    });

    const afterProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-2",
    });

    expect(afterProfile.ratingSummary).toEqual(beforeProfile.ratingSummary);
  });

  it("should reject a review when required content is missing and keep the aggregate unchanged", async () => {
    const { createReviewAction } = await import("../src/app/profiles/[id]/actions");
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const beforeProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-3",
    });

    await expect(
      createReviewAction({
        session: {
          user: {
            id: "user-reviewer-3",
            name: "Casey",
            email: "casey@example.com",
          },
        },
        profileId: "owner-jordan",
        input: {
          rating: 4,
          content: "",
        },
      }),
    ).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fieldErrors: {
        content: expect.any(Array),
      },
    });

    const afterProfile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-3",
    });

    expect(afterProfile.ratingSummary).toEqual(beforeProfile.ratingSummary);
  });

  it("should accept the minimum valid review boundary values and reflect them in the profile summary", async () => {
    const { createReviewAction } = await import("../src/app/profiles/[id]/actions");
    const { getProfilePageData } = await import("../src/lib/profiles/queries");

    const createdReview = await createReviewAction({
      session: {
        user: {
          id: "user-reviewer-4",
          name: "Riley",
          email: "riley@example.com",
        },
      },
      profileId: "owner-jordan",
      input: {
        rating: 1,
        content: "Good.",
      },
    });

    expect(createdReview).toMatchObject({
      rating: 1,
      content: "Good.",
    });

    const profile = await getProfilePageData({
      profileId: "owner-jordan",
      viewerId: "user-reviewer-4",
    });

    expect(profile.reviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdReview.id,
          rating: 1,
          content: "Good.",
        }),
      ]),
    );
  });

  it("should require authentication before allowing a visitor to submit a visible review or rating", async () => {
    const { createReviewAction } = await import("../src/app/profiles/[id]/actions");

    await expect(
      createReviewAction({
        session: null,
        profileId: "owner-jordan",
        input: {
          rating: 5,
          content: "Visitors should be prompted to sign in.",
        },
      }),
    ).rejects.toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
      redirectTo: "/signin?callbackUrl=%2Fprofiles%2Fowner-jordan",
    });
  });
});
