import { calculateRatingSummary, createEmptyRatingAggregate, type RatingAggregate } from '../ratings';
import { reviewInputSchema, type ReviewInput } from '../validation/review';

export type ReviewRecord = ReviewInput & {
  id: string;
  profileId: string;
  authorId: string;
  createdAt: string;
};

export type CreateReviewArgs = {
  profileId: string;
  authorId: string;
  input: ReviewInput;
};

export type ReviewMutationResult = {
  review: ReviewRecord;
  ratingAggregate: RatingAggregate;
};

const reviewsByProfileId = new Map<string, ReviewRecord[]>();
const ratingAggregateByProfileId = new Map<string, RatingAggregate>();
let nextReviewSequence = 1;

function createReviewId(): string {
  const reviewId = `review-${nextReviewSequence}`;
  nextReviewSequence += 1;
  return reviewId;
}

function getReviewList(profileId: string): ReviewRecord[] {
  const reviews = reviewsByProfileId.get(profileId);
  if (reviews) return reviews;
  const emptyReviews: ReviewRecord[] = [];
  reviewsByProfileId.set(profileId, emptyReviews);
  return emptyReviews;
}

export function validateReviewInput(input: ReviewInput): ReviewInput {
  return reviewInputSchema.parse(input);
}

export function getReviewRatingAggregate(profileId: string): RatingAggregate {
  return ratingAggregateByProfileId.get(profileId) ?? createEmptyRatingAggregate();
}

export function getProfileReviews(profileId: string): ReviewRecord[] {
  return [...getReviewList(profileId)];
}

export function createReview(args: CreateReviewArgs): ReviewMutationResult {
  const validatedInput = validateReviewInput(args.input);
  const review: ReviewRecord = {
    id: createReviewId(),
    profileId: args.profileId,
    authorId: args.authorId,
    rating: validatedInput.rating,
    content: validatedInput.content,
    createdAt: new Date().toISOString(),
  };

  const reviews = [...getReviewList(args.profileId), review];
  reviewsByProfileId.set(args.profileId, reviews);

  const ratingAggregate = calculateRatingSummary(reviews);
  ratingAggregateByProfileId.set(args.profileId, ratingAggregate);

  return { review, ratingAggregate };
}

export function resetReviewState(): void {
  reviewsByProfileId.clear();
  ratingAggregateByProfileId.clear();
  nextReviewSequence = 1;
}
