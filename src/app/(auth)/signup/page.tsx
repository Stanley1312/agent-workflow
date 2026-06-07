import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { AuthForm } from '@/components/auth/auth-form';
import { signUpFromForm } from '../auth-actions';

export const metadata: Metadata = {
  title: 'Sign up | MatchMarket',
};

type SignUpPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? '/';
  const signInHref = `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <AuthShell
      brandActionLabel="Already have an account?"
      brandActionHref={signInHref}
      brandActionText="Sign in"
      eyebrow="Create an account to unlock protected marketplace actions."
      headline="Start selling on MatchMarket"
      description="Create your account to manage listings, keep your profile updated, and return to any protected marketplace action after sign-up."
      testimonialQuote="A connected account keeps the marketplace action you started intact, even if you need to sign up first."
      testimonialAuthor="MatchMarket members"
      testimonialMeta="Protected marketplace access"
    >
      <AuthForm
        activeTab="signup"
        title="Create your account"
        subtitle="Register once to continue back to the intended marketplace action."
        fields={[
          { id: 'displayName', label: 'Display name', type: 'text', autoComplete: 'name' },
          { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
        ]}
        primaryActionLabel="Create account"
        secondaryActionLabel="Sign in instead"
        secondaryActionHref={signInHref}
        action={signUpFromForm}
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      </AuthForm>
    </AuthShell>
  );
}
