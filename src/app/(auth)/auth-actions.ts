"use server";

import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import prismaClient from '../../lib/prisma';
import { hashPassword, verifyPassword } from '../../lib/password';
import { loginInputSchema, registrationInputSchema, type LoginInput, type RegistrationInput } from '../../lib/validation/auth';

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  user: AuthSessionUser;
  isAuthenticated: true;
} | null;

export type AuthActionError = {
  code: string;
  message: string;
  fieldErrors?: Partial<Record<keyof RegistrationInput | keyof LoginInput | 'confirmPassword', string[]>>;
};

const DUPLICATE_EMAIL_CODE = 'P2002';
const INVALID_CREDENTIALS_CODE = 'INVALID_CREDENTIALS';
const EMAIL_ALREADY_IN_USE_CODE = 'EMAIL_ALREADY_IN_USE';

const sessionStore = new Map<string, AuthSessionUser>();
let activeSessionId: string | null = null;
const AUTH_SESSION_COOKIE_NAME = 'authjs.session-token';
const AUTH_SESSION_COOKIE_SECURE_NAME = '__Secure-authjs.session-token';

function toFieldErrors(error: ZodError): AuthActionError['fieldErrors'] {
  return error.flatten().fieldErrors;
}

function persistSessionCookie(sessionId: string): void {
  const cookieStore = cookies();
  cookieStore.set(AUTH_SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  cookieStore.set(AUTH_SESSION_COOKIE_SECURE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: true,
  });
}

function createSession(user: AuthSessionUser): AuthSession {
  const sessionId = user.id;
  sessionStore.set(sessionId, user);
  activeSessionId = sessionId;
  persistSessionCookie(sessionId);
  return { user, isAuthenticated: true };
}

function normalizeEmail(email: string): string {
  return email.toLowerCase();
}

export async function registerUser(input: RegistrationInput): Promise<AuthSession> {
  const parsedInput = registrationInputSchema.parse(input);
  const email = normalizeEmail(parsedInput.email);

  try {
    const createdUser = await prismaClient.user.create({
      data: {
        email,
        name: parsedInput.name,
        passwordHash: hashPassword(parsedInput.password),
        profile: {
          create: {
            displayName: parsedInput.name,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return createSession({
      id: String(createdUser.id ?? ''),
      name: String(createdUser.name ?? ''),
      email: String(createdUser.email ?? email),
    });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === DUPLICATE_EMAIL_CODE) {
      throw {
        code: EMAIL_ALREADY_IN_USE_CODE,
        message: 'An account with that email already exists.',
        fieldErrors: { email: ['An account with that email already exists.'] },
      } satisfies AuthActionError;
    }

    if (error instanceof ZodError) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Please fix the highlighted fields and try again.',
        fieldErrors: toFieldErrors(error),
      } satisfies AuthActionError;
    }

    throw error;
  }
}

export async function signInUser(input: LoginInput): Promise<AuthSession> {
  try {
    const parsedInput = loginInputSchema.parse(input);
    const user = await prismaClient.user.findUnique({
      where: { email: normalizeEmail(parsedInput.email) },
    });

    if (!user || !verifyPassword(parsedInput.password, user.passwordHash)) {
      throw {
        code: INVALID_CREDENTIALS_CODE,
        message: 'Invalid email or password.',
        fieldErrors: { email: ['Invalid email or password.'] },
      } satisfies AuthActionError;
    }

    return createSession({ id: user.id, name: user.name ?? '', email: user.email });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw {
        code: 'INVALID_INPUT',
        message: 'Please fix the highlighted fields and try again.',
        fieldErrors: toFieldErrors(error),
      } satisfies AuthActionError;
    }

    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  if (activeSessionId) {
    sessionStore.delete(activeSessionId);
  }
  activeSessionId = null;
  const cookieStore = cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE_NAME);
  cookieStore.delete(AUTH_SESSION_COOKIE_SECURE_NAME);
}

export async function getSession(): Promise<AuthSession> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value ?? cookieStore.get(AUTH_SESSION_COOKIE_SECURE_NAME)?.value ?? activeSessionId;
  if (!sessionId) {
    return null;
  }

  const user = sessionStore.get(sessionId);
  return user ? { user, isAuthenticated: true } : null;
}

export type AuthActionResult = {
  redirectTo?: string;
  formState: {
    message: string | null;
    fieldErrors?: Partial<Record<string, string[]>>;
    redirectTo?: string;
  };
};

function parseFormData(formData: FormData): Record<string, string> {
  return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
}

function createSingleAlertState(message: string, fieldErrors?: AuthActionResult['formState']['fieldErrors']): AuthActionResult['formState'] {
  return { message, fieldErrors };
}

export async function signInFromForm(previousState: AuthActionResult['formState'], formData: FormData): Promise<AuthActionResult['formState']> {
  try {
    const fields = parseFormData(formData);
    await signInUser({ email: fields.email ?? '', password: fields.password ?? '' });
    return { message: null, redirectTo: fields.callbackUrl ?? '/' };
  } catch (error) {
    const authError = error as AuthActionError;
    return createSingleAlertState(authError.message, authError.fieldErrors ?? previousState.fieldErrors);
  }
}

export async function signUpFromForm(previousState: AuthActionResult['formState'], formData: FormData): Promise<AuthActionResult['formState']> {
  try {
    const fields = parseFormData(formData);
    await registerUser({ name: fields.displayName ?? '', email: fields.email ?? '', password: fields.password ?? '', confirmPassword: fields.password ?? '' });
    return { message: null, redirectTo: fields.callbackUrl ?? '/' };
  } catch (error) {
    const authError = error as AuthActionError;
    return createSingleAlertState(authError.message, authError.fieldErrors ?? previousState.fieldErrors);
  }
}
