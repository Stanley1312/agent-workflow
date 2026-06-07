import type { AuthSession } from '../../app/(auth)/auth-actions';

export type ListingOwnerRecord = {
  ownerId: string;
};

export function canManageListing(session: AuthSession, listing: ListingOwnerRecord): boolean {
  return Boolean(session?.user?.id && session.user.id === listing.ownerId);
}

export function assertListingOwnership(session: AuthSession, listing: ListingOwnerRecord): void {
  if (!canManageListing(session, listing)) {
    throw new Error('UNAUTHORIZED_LISTING_ACTION');
  }
}
