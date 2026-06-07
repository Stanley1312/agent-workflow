import { z } from "zod";

const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_REVIEW_LENGTH = 2000;

const ratingSchema = z.coerce.number().int('Rating must be a whole number').min(MIN_RATING, 'Rating must be at least 1').max(MAX_RATING, 'Rating must be at most 5');
const reviewContentSchema = z.string().trim().min(1, 'Review content is required').max(MAX_REVIEW_LENGTH, 'Review content must be 2000 characters or fewer');

export const reviewInputSchema = z.object({
  rating: ratingSchema,
  content: reviewContentSchema,
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
