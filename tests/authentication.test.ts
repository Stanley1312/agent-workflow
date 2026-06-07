import { describe, expect, it } from "vitest";

describe("authentication and authorization", () => {
  it("should reject registration when required credentials are missing", async () => {
    const { registrationInputSchema } = await import("../src/lib/validation/auth");
    const result = registrationInputSchema.safeParse({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors).toMatchObject({
      name: expect.any(Array),
      email: expect.any(Array),
      password: expect.any(Array),
      confirmPassword: expect.any(Array),
      acceptTerms: expect.any(Array),
    });
  });

  it("should reject login when email or password is missing", async () => {
    const { loginInputSchema } = await import("../src/lib/validation/auth");
    const result = loginInputSchema.safeParse({
      email: "",
      password: "",
      rememberMe: false,
    });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors).toMatchObject({
      email: expect.any(Array),
      password: expect.any(Array),
    });
  });

  it("should reject authentication when credentials are invalid", async () => {
    const { signInUser } = await import("../src/app/(auth)/auth-actions");

    await expect(
      signInUser({
        email: "unknown@example.com",
        password: "wrong-password",
        rememberMe: false,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
      fieldErrors: {
        email: expect.any(Array),
      },
    });
  });

  it("should reject registration when the email already belongs to an existing account", async () => {
    const { registerUser } = await import("../src/app/(auth)/auth-actions");

    await registerUser({
      name: "Existing Seller",
      email: "seller@example.com",
      password: "super-secure-password",
      confirmPassword: "super-secure-password",
      acceptTerms: true,
    });

    await expect(
      registerUser({
        name: "Existing Seller Clone",
        email: "seller@example.com",
        password: "super-secure-password",
        confirmPassword: "super-secure-password",
        acceptTerms: true,
      }),
    ).rejects.toMatchObject({
      code: "EMAIL_ALREADY_IN_USE",
      fieldErrors: {
        email: expect.any(Array),
      },
    });
  });

  it("should create an authenticated session when registration succeeds with valid credentials", async () => {
    const { registerUser } = await import("../src/app/(auth)/auth-actions");

    const session = await registerUser({
      name: "New Seller",
      email: "new-seller@example.com",
      password: "super-secure-password",
      confirmPassword: "super-secure-password",
      acceptTerms: true,
    });

    expect(session).toMatchObject({
      user: {
        id: expect.any(String),
        name: "New Seller",
        email: "new-seller@example.com",
      },
      isAuthenticated: true,
    });
    expect(session.user.passwordHash).toBeUndefined();
  });

  it("should create an authenticated session when login succeeds with valid credentials and end it on sign out", async () => {
    const { registerUser, signInUser, signOutUser } = await import("../src/app/(auth)/auth-actions");
    const { getSession } = await import("../src/auth");

    await registerUser({
      name: "Returning Seller",
      email: "returning-seller@example.com",
      password: "super-secure-password",
      confirmPassword: "super-secure-password",
      acceptTerms: true,
    });

    const session = await signInUser({
      email: "returning-seller@example.com",
      password: "super-secure-password",
      rememberMe: true,
    });

    expect(session).toMatchObject({
      user: {
        id: expect.any(String),
        email: "returning-seller@example.com",
      },
      isAuthenticated: true,
    });

    await signOutUser();

    await expect(getSession()).resolves.toBeNull();
  });

  it("should require authentication before allowing a visitor to continue to a protected listing action", async () => {
    const { requireAuthenticatedAction } = await import("../src/auth");

    await expect(
      requireAuthenticatedAction({
        session: null,
        action: "create-listing",
        redirectTo: "/listings/new",
      }),
    ).rejects.toMatchObject({
      code: "AUTHENTICATION_REQUIRED",
      redirectTo: "/signin?callbackUrl=%2Flistings%2Fnew",
    });
  });

  it("should deny a protected listing mutation when the authenticated user does not own the listing", async () => {
    const { ensureListingOwnership } = await import("../src/auth");

    await expect(
      ensureListingOwnership({
        session: {
          user: {
            id: "user-non-owner",
            email: "viewer@example.com",
          },
        },
        listing: {
          id: "listing-owner-1",
          ownerId: "user-owner-1",
        },
        action: "delete-listing",
      }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      listingId: "listing-owner-1",
      action: "delete-listing",
    });
  });
});
