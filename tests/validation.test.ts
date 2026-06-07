import { describe, expect, it } from "vitest";

describe("listing validation", () => {
  it("should reject listing data when title price description or hidden image reference is invalid", async () => {
    const { listingInputSchema } = await import("../src/lib/validation/listing");
    const result = listingInputSchema.safeParse({
      title: "",
      priceCents: 0,
      category: "",
      condition: "used",
      description: "",
      imageAssetIds: ["unsupported-hidden-image-reference"],
    });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors).toMatchObject({
      title: expect.any(Array),
      priceCents: expect.any(Array),
      category: expect.any(Array),
      description: expect.any(Array),
      imageAssetIds: expect.any(Array),
    });
  });

  it("should accept listing data when minimum valid boundary values satisfy persistence rules without a user-supplied image", async () => {
    const { listingInputSchema } = await import("../src/lib/validation/listing");
    const result = listingInputSchema.safeParse({
      title: "Chair",
      priceCents: 100,
      category: "home",
      condition: "used",
      description: "Solid chair.",
    });

    expect(result.success).toBe(true);
  });
});

describe("review validation", () => {
  it("should reject review data when rating is outside the allowed range", async () => {
    const { reviewInputSchema } = await import("../src/lib/validation/review");
    const result = reviewInputSchema.safeParse({
      profileId: "profile-1",
      rating: 6,
      content: "Great seller.",
    });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.rating).toEqual(expect.any(Array));
  });

  it("should reject review data when required content is missing", async () => {
    const { reviewInputSchema } = await import("../src/lib/validation/review");
    const result = reviewInputSchema.safeParse({
      profileId: "profile-1",
      rating: 4,
      content: "",
    });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.content).toEqual(expect.any(Array));
  });

  it("should preserve rating aggregates when invalid review input is rejected", async () => {
    const { reviewInputSchema } = await import("../src/lib/validation/review");
    const { calculateRatingSummary } = await import("../src/lib/ratings");
    const existingReviews = [
      { id: "review-1", rating: 4, content: "Accurate item description." },
      { id: "review-2", rating: 2, content: "Pickup was delayed." },
    ];
    const beforeSummary = calculateRatingSummary(existingReviews);
    const result = reviewInputSchema.safeParse({
      profileId: "profile-1",
      rating: 0,
      content: "",
    });
    const afterSummary = calculateRatingSummary(existingReviews);

    expect(result.success).toBe(false);
    expect(afterSummary).toEqual(beforeSummary);
  });
});
