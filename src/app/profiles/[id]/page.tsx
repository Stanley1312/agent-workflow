import { ProfileHeader } from '../../../components/profile/profile-header';
import { ProfileListings } from '../../../components/profile/profile-listings';
import { ProfileStats } from '../../../components/profile/profile-stats';
import { ProfileTabs } from '../../../components/profile/profile-tabs';
import { getProfilePageData } from '../../../lib/profiles/queries';

export async function getProfileTabView({ profileId, viewerId, activeTab }: { profileId: string; viewerId: string | null; activeTab: 'listings' | 'reviews' }): Promise<{ activeTab: 'listings' | 'reviews'; tabs: Array<{ key: string; label: string; isActive: boolean }>; section: { key: 'listings' | 'reviews'; items: unknown[] } }> {
  const profilePageData = await getProfilePageData({ profileId, viewerId });
  const tabs = profilePageData.tabs.map((tab) => ({ ...tab, isActive: tab.key === activeTab }));
  const items = activeTab === 'listings' ? [...profilePageData.listings] : [...profilePageData.reviews];

  return {
    activeTab,
    tabs,
    section: { key: activeTab, items },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profilePageData = await getProfilePageData({ profileId: id, viewerId: null });
  const tabs = profilePageData.tabs.map((tab) => ({ id: tab.key, label: tab.label, href: `#${tab.key}`, isActive: tab.isActive ?? false }));

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8 text-[color:var(--text-primary)] lg:px-10">
      <ProfileHeader name={profilePageData.profile.displayName} reviewCount={profilePageData.summary.reviewCount} ratingAverage={profilePageData.ratingSummary.averageRating} isOwnProfile={false} />
      <ProfileStats completedDeals={profilePageData.summary.listingCount} averageRating={profilePageData.ratingSummary.averageRating} responseRate="100%" />
      <ProfileTabs tabs={tabs} />
      <div id="listings">
        <ProfileListings listings={profilePageData.listings.map((listing) => ({ id: listing.id, title: listing.title, priceLabel: `$${(listing.priceCents / 100).toFixed(2)}`, description: listing.description, href: `/listings/${listing.id}` }))} />
      </div>
      <section id="reviews" className="rounded-lg border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <h2 className="text-[18px] font-bold text-[color:var(--text-primary)]">Reviews</h2>
        {profilePageData.reviews.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {profilePageData.reviews.map((review) => (
              <li key={review.id} className="rounded-md border border-[color:var(--border)] p-4">
                <p className="text-sm text-[color:var(--text-secondary)]">{review.content}</p>
                <p className="mt-2 text-sm font-semibold">Rating: {review.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{profilePageData.emptyStates.reviews.title}</p>
        )}
      </section>
    </main>
  );
}
