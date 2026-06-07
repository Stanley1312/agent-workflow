type ProfileHeaderProps = {
  name: string;
  location?: string;
  memberSince?: string;
  ratingAverage?: number;
  reviewCount?: number;
  badges?: string[];
  isOwnProfile?: boolean;
};

const defaultBadges = ['Top Rated', 'Fast Responder', 'Verified'];

function formatRating(ratingAverage?: number): string {
  if (typeof ratingAverage !== 'number' || Number.isNaN(ratingAverage)) {
    return '0.0';
  }

  return ratingAverage.toFixed(1);
}

export function ProfileHeader({
  name,
  location = 'Local marketplace seller',
  memberSince = 'Member since 2024',
  ratingAverage,
  reviewCount = 0,
  badges = defaultBadges,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E7E3DA] bg-white shadow-[0_1px_2px_rgba(17,15,23,0.06)]">
      <div className="h-2 bg-[linear-gradient(90deg,#6F3CC3_0%,#B995E8_100%)]" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#6F3CC3] text-xl font-bold text-white shadow-sm">
              {name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('')
                .slice(0, 2) || 'M'}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B6774]">Profile</p>
                <h1 className="mt-2 text-[32px] font-extrabold leading-tight text-[#17151F]">{name}</h1>
                <p className="mt-1 text-sm text-[#6B6774]">{location} · {memberSince}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#17151F]">
                <span className="text-[#F59E0B]">★★★★★</span>
                <span>{formatRating(ratingAverage)}</span>
                <span className="text-[#6B6774]">({reviewCount} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-full bg-[#F7F6F3] px-3 py-1 text-xs font-semibold text-[#17151F]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isOwnProfile ? (
            <a href="#edit-profile" className="inline-flex items-center justify-center rounded-full bg-[#16151D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2B2935]">
              Edit profile
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
