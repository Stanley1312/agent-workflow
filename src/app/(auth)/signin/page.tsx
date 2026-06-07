import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { AuthForm } from '@/components/auth/auth-form';
import { signInFromForm } from '../auth-actions';

export const metadata: Metadata = {
  title: 'Sign in | MatchMarket',
};

type SignInPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? '/';
  const signUpHref = `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <AuthShell
      brandActionLabel="New here?"
      brandActionHref={signUpHref}
      brandActionText="Create account"
      eyebrow="Authenticate to save listings, manage your own items, and continue protected actions."
      headline="Welcome back to MatchMarket"
      description="Sign in to continue browsing, manage your listings, and return to the marketplace action you started."
      testimonialQuote="The fastest way to get back to a saved deal is to keep your account connected across browse, detail, and listing flows."
      testimonialAuthor="MatchMarket members"
      testimonialMeta="Protected marketplace access"
    >
      <AuthForm
        activeTab="signin"
        title="Sign in"
        subtitle="Use your credentials to return to the marketplace."
        fields={[
          { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { id: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
        ]}
        primaryActionLabel="Sign in"
        secondaryActionLabel="Create an account instead"
        secondaryActionHref={signUpHref}
        action={signInFromForm}
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      </AuthForm>
    </AuthShell>
  );
}
