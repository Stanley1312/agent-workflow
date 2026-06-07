export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  user: AuthSessionUser;
} | null;

export type AuthenticationRequiredError = {
  code: 'AUTHENTICATION_REQUIRED';
  action: string;
  redirectTo: string;
};

export type ForbiddenError = {
  code: 'FORBIDDEN';
  action: string;
  listingId: string;
};

export async function getSession(): Promise<AuthSession> {
  return null;
}

export async function requireAuthenticatedAction({
  session,
  action,
  redirectTo,
}: {
  session: AuthSession;
  action: string;
  redirectTo: string;
}): Promise<AuthSessionUser> {
  if (!session?.user?.id) {
    throw {
      code: 'AUTHENTICATION_REQUIRED',
      action,
      redirectTo: `/signin?callbackUrl=${encodeURIComponent(redirectTo)}`,
    } satisfies AuthenticationRequiredError;
  }

  return session.user;
}

export function getSigninCallbackUrl(redirectTo: string): string {
  return `/signin?callbackUrl=${encodeURIComponent(redirectTo)}`;
}

export async function ensureListingOwnership({
  session,
  listing,
  action,
}: {
  session: AuthSession;
  listing: { id: string; ownerId: string };
  action: string;
}): Promise<void> {
  if (!session?.user?.id || session.user.id !== listing.ownerId) {
    throw {
      code: 'FORBIDDEN',
      action,
      listingId: listing.id,
    } satisfies ForbiddenError;
  }
}
