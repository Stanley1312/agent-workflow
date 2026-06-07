type ProfileStatsProps = {
  completedDeals: number;
  averageRating: number;
  responseRate: string;
};

function buildStatCard(label: string, value: string, helperText?: string) {
  return (
    <article className="rounded-[20px] border border-[#E7E3DA] bg-white p-5 shadow-[0_1px_2px_rgba(17,15,23,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6774]">{label}</p>
      <div className="mt-2 text-[28px] font-extrabold text-[#17151F]">{value}</div>
      {helperText ? <p className="mt-1 text-sm text-[#6B6774]">{helperText}</p> : null}
    </article>
  );
}

export function ProfileStats({ completedDeals, averageRating, responseRate }: ProfileStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {buildStatCard('Completed deals', completedDeals.toString(), 'Transactions completed on MatchMarket')}
      {buildStatCard('Average rating', averageRating.toFixed(1), 'Across recent reviews')}
      {buildStatCard('Response rate', responseRate, 'Typical reply speed')}
    </section>
  );
}
