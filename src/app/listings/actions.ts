"use server";

import { ZodError } from 'zod';

import { createListing, deleteListing, updateListing } from '../../lib/listings/mutations';
import type { AuthSession } from '../(auth)/auth-actions';

export type ListingActionError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  listingId?: string;
  action?: string;
};

export type ListingActionContext = {
  session: AuthSession | null;
};

export type CreateListingActionInput = ListingActionContext & {
  input: unknown;
};

export type UpdateListingActionInput = ListingActionContext & {
  listingId: string;
  input: unknown;
};

export type DeleteListingActionInput = ListingActionContext & {
  listingId: string;
  confirm?: boolean;
};

function toFieldErrors(error: ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors;
}

function createUnauthorizedError(): ListingActionError {
  return {
    code: 'UNAUTHORIZED',
    message: 'You must be signed in to manage listings.',
  };
}

function createForbiddenError(listingId: string, action: string): ListingActionError {
  return {
    code: 'FORBIDDEN',
    message: 'You can only manage your own listings.',
    listingId,
    action,
  };
}

function toValidationError(error: ZodError): ListingActionError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Please fix the highlighted fields and try again.',
    fieldErrors: toFieldErrors(error),
  };
}

function getAuthenticatedUserId(session: AuthSession | null): string | null {
  return session?.user?.id ?? null;
}

export async function createListingAction({ session, input }: CreateListingActionInput): Promise<{ id: string; ownerId: string; title: string; priceCents: number; category: string; condition: string; description: string; image: { src: string; alt: string } }> {
  const userId = getAuthenticatedUserId(session);
  if (!userId) {
    throw createUnauthorizedError();
  }

  try {
    const listing = createListing({ ownerId: userId, input: input as never });
    return { ...listing, image: { src: `/images/listings/${listing.id}.png`, alt: listing.title } };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw toValidationError(error);
    }

    throw error;
  }
}

export async function updateListingAction({ session, listingId, input }: UpdateListingActionInput): Promise<{ id: string; ownerId: string; title: string; priceCents: number; category: string; condition: string; description: string; image: { src: string; alt: string } }> {
  const userId = getAuthenticatedUserId(session);
  if (!userId) {
    throw createUnauthorizedError();
  }

  try {
    return updateListing({ listingId, ownerId: userId, input: input as never });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw toValidationError(error);
    }
    if (error instanceof Error && error.message === 'UNAUTHORIZED_LISTING_ACTION') {
      throw createForbiddenError(listingId, 'edit-listing');
    }

    throw error;
  }
}

export async function deleteListingAction({ session, listingId, confirm }: DeleteListingActionInput): Promise<{ deletedListingId: string; redirectTo: string }> {
  const userId = getAuthenticatedUserId(session);
  if (!userId) {
    throw createUnauthorizedError();
  }

  try {
    deleteListing({ listingId, ownerId: userId });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_LISTING_ACTION') {
      throw createForbiddenError(listingId, 'delete-listing');
    }

    throw error;
  }

  if (!confirm) {
    return { deletedListingId: listingId, redirectTo: `/listings/${listingId}` };
  }

  return { deletedListingId: listingId, redirectTo: '/' };
}
