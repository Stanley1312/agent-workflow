import { notFound, redirect } from 'next/navigation';

import { ListingForm, type ListingFormValues } from '../../../../components/listings/listing-form';
import { findManagedListing, updateListingAction } from '../../actions';

type ListingEditPageProps = {
  params: Promise<{ id: string }>;
};

function toFormValues(listing: NonNullable<ReturnType<typeof findManagedListing>>): ListingFormValues {
  return {
    title: listing.title,
    price: String(listing.priceCents / 100),
    category: listing.category,
    condition: listing.condition,
    location: 'Local pickup',
    description: listing.description,
  };
}

export default async function ListingEditPage({ params }: ListingEditPageProps) {
  const { id } = await params;
  const listing = findManagedListing(id);

  if (!listing) {
    notFound();
  }

  async function handleSubmit(values: ListingFormValues): Promise<void> {
    'use server';

    const result = await updateListingAction({
      session: null,
      listingId: id,
      input: {
        title: values.title,
        priceCents: Number(values.price) * 100,
        category: values.category,
        condition: values.condition,
        description: values.description,
      },
    });

    redirect(`/listings/${result.listingId}`);
  }

  return (
    <main className="min-h-screen bg-[#FBF8F2] px-6 py-10 text-[#16151D] lg:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6D627A]">Listing management</p>
          <h1 className="text-4xl font-semibold tracking-tight">Edit listing</h1>
          <p className="max-w-2xl text-sm leading-6 text-[#5B4F6C]">Update the listing details and save changes to keep browse, detail, and profile views consistent.</p>
        </header>

        <section className="rounded-[28px] border border-[#E7E0D5] bg-white p-6 shadow-[0_22px_70px_rgba(37,24,74,0.08)]">
          <ListingForm defaultValues={toFormValues(listing)} submitLabel="Save changes" onSubmit={handleSubmit} />
        </section>
      </div>
    </main>
  );
}
