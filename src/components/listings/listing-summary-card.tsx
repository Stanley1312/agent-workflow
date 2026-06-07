import type { ReactNode } from 'react';

export type SummaryItem = {
  label: string;
  value: string;
};

type ListingSummaryCardProps = {
  priceLabel: string;
  title: string;
  condition: string;
  status: string;
  facts: SummaryItem[];
  sellerName: string;
  sellerHref: string;
  startDealHref: string;
  relatedProposal?: ReactNode;
};

export function ListingSummaryCard({
  priceLabel,
  title,
  condition,
  status,
  facts,
  sellerName,
  sellerHref,
  startDealHref,
  relatedProposal,
}: ListingSummaryCardProps) {
  return (
    <aside className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_22px_70px_rgba(37,24,74,0.08)] lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-extrabold tracking-tight text-[color:var(--primary)]">{priceLabel}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">{status}</p>
        </div>
        <span className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[color:var(--text-secondary)]">{condition}</span>
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">{title}</h2>

      <dl className="mt-6 grid gap-3 text-sm text-[color:var(--text-secondary)]">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between gap-4 rounded-2xl bg-[color:var(--surface-alt)] px-4 py-3">
            <dt className="font-medium">{fact.label}</dt>
            <dd className="font-semibold text-[color:var(--text-primary)]">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-alt)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">Seller</p>
        <a href={sellerHref} className="mt-2 inline-flex font-semibold text-[color:var(--accent)] hover:underline">
          {sellerName}
        </a>
      </div>

      <a
        href={startDealHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-3.5 text-base font-semibold text-white shadow-[0_10px_25px_rgba(17,15,23,0.18)] transition-colors hover:bg-[color:var(--primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-light)] focus-visible:ring-offset-2"
      >
        Start a deal
      </a>

      {relatedProposal ? <div className="mt-5">{relatedProposal}</div> : null}
    </aside>
  );
}
