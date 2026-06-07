import React from 'react';

type PrimaryNavigationItem = {
  label: string;
  href: string;
  unavailable?: boolean;
  protected?: boolean;
};

const primaryNavigationItems: PrimaryNavigationItem[] = [
  { label: 'Browse', href: '/' },
  { label: 'Post', href: '/listings/new', protected: true },
  { label: 'Deals', href: '#', unavailable: true },
  { label: 'Inbox', href: '#', unavailable: true },
];

type GlobalNavProps = {
  session?: unknown;
  pathname?: string;
};

export async function getPrimaryNavigationActions({ session, pathname }: GlobalNavProps): Promise<Array<{ label: string; href: string; requiresAuthentication?: boolean }>> {
  const isAuthenticated = Boolean(session);
  return primaryNavigationItems.map((item) => {
    if (item.protected && !isAuthenticated) {
      return { label: item.label, href: '/signin?callbackUrl=%2Flistings%2Fnew', requiresAuthentication: true };
    }

    if (item.label === 'Browse' && pathname === '/') {
      return { label: item.label, href: item.href };
    }

    return { label: item.label, href: item.href };
  });
}

export function GlobalNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 text-[color:var(--primary)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--accent)] text-sm font-semibold text-white shadow-sm">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">MatchMarket</span>
        </a>

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
          {primaryNavigationItems.map((item) => {
            const isBrowse = item.label === 'Browse';
            const className = [
              'rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2',
              isBrowse
                ? 'bg-[color:var(--surface-alt)] text-[color:var(--primary)] shadow-sm'
                : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--primary)]',
            ].join(' ');

            return item.unavailable ? (
              <a key={item.label} href={item.href} aria-disabled="true" title={`${item.label} is not available in this phase`} className="rounded-full px-4 py-2 text-sm font-medium text-[color:var(--text-secondary)]/60">
                {item.label}
              </a>
            ) : (
              <a key={item.label} href={item.href} aria-current={isBrowse ? 'page' : undefined} className={className}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <label className="relative hidden w-full max-w-xs lg:block">
            <span className="sr-only">Search listings</span>
            <input type="search" placeholder="Search products" className="w-full rounded-full border border-[color:var(--border)] bg-[color:var(--surface-alt)] px-4 py-2 pl-10 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-light)]/30" />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]">Search</span>
          </label>

          <a href="/listings/new" className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            Create listing
          </a>

          <button type="button" aria-label="Notifications, 3 unread" className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-sm font-semibold text-[color:var(--text-secondary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            3
          </button>

          <a href="/profiles/owner-avery" aria-label="Account profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            JD
          </a>
          <a href="/profiles/me" className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] shadow-sm transition hover:bg-[color:var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            My profile
          </a>
        </div>
      </div>
    </header>
  );
}
