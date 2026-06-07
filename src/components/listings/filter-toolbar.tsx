import React from 'react';

type FilterToolbarProps = {
  totalResults: number;
  category?: string | null;
};

const filterChips = [
  { label: 'All', href: '/' },
  { label: 'Category', href: '/?category=electronics' },
  { label: 'Electronics', href: '/?category=electronics' },
  { label: 'Furniture', href: '/?category=furniture' },
  { label: 'Clothing', href: '/?category=clothing' },
  { label: 'No match', href: '/?category=nonexistent' },
] as const;

export function FilterToolbar({ totalResults, category }: FilterToolbarProps) {
  return (
    <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">Catalog</p>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">Browse</h1>
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">Showing {totalResults} listings with product imagery, quick filters, and live updates.</p>
            </div>
          </div>
          <p className="max-w-sm text-sm font-medium text-[color:var(--text-secondary)]">Refine the catalog by category, price, distance, condition, or sort order.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((chip) => {
            const isActive = chip.label.toLowerCase() !== 'all' && chip.label.toLowerCase() !== 'category' && (category ?? '') === chip.label.toLowerCase();
            return (
              <a
                key={chip.label}
                href={chip.href}
                aria-pressed={isActive}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2',
                  isActive
                    ? 'border-[color:var(--accent-light)] bg-[color:var(--surface-alt)] text-[color:var(--accent-dark)]'
                    : 'border-[color:var(--border)] bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-light)] hover:text-[color:var(--accent-dark)]',
                ].join(' ')}
              >
                {chip.label}
              </a>
            );
          })}
          <button type="button" className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            Save search
          </button>
          <a href="/" aria-label="Reset browse filters" className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2">
            Reset
          </a>
        </div>
      </div>
    </section>
  );
}
