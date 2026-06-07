"use server";

import { ZodError } from 'zod';

import { createReview, getProfileReviews, getReviewRatingAggregate } from '../../../lib/reviews/mutations';
import type { AuthSession } from '../../(auth)/auth-actions';
import { reviewInputSchema } from '../../../lib/validation/review';

export type ProfileActionError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  profileId?: string;
  action?: string;
  redirectTo?: string;
};

export type ReviewActionContext = {
  session: AuthSession | null;
};

export type CreateReviewActionInput = {
  profileId: string;
  session: AuthSession | null;
  input: unknown;
};

function toFieldErrors(error: ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors;
}

function createAuthenticationError(profileId: string): ProfileActionError {
  return {
    code: 'AUTHENTICATION_REQUIRED',
    message: 'You must be signed in to leave a review.',
    redirectTo: `/signin?callbackUrl=${encodeURIComponent(`/profiles/${profileId}`)}`,
  };
}

function toValidationError(error: ZodError): ProfileActionError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Please fix the highlighted fields and try again.',
    fieldErrors: toFieldErrors(error),
  };
}

function getAuthenticatedUserId(session: AuthSession | null): string | null {
  return session?.user?.id ?? null;
}

export async function createReviewAction({ profileId, session, input }: CreateReviewActionInput): Promise<{ id: string; profileId: string; authorId: string; rating: number; content: string; reviewCount: number; averageRating: number }> {
  const userId = getAuthenticatedUserId(session);
  if (!userId) {
    throw createAuthenticationError(profileId);
  }

  try {
    const validatedInput = reviewInputSchema.parse(input);
    const mutationResult = createReview({ profileId, authorId: userId, input: validatedInput });
    return { ...mutationResult.review, reviewCount: mutationResult.ratingAggregate.reviewCount, averageRating: mutationResult.ratingAggregate.averageRating };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw toValidationError(error);
    }

    throw error;
  }
}

export async function getProfileReviewSummary(profileId: string): Promise<{ reviewCount: number; averageRating: number }> {
  const ratingAggregate = getReviewRatingAggregate(profileId);
  return { reviewCount: ratingAggregate.reviewCount, averageRating: ratingAggregate.averageRating };
}

export async function getProfileReviewCount(profileId: string): Promise<number> {
  return getProfileReviews(profileId).length;
}
