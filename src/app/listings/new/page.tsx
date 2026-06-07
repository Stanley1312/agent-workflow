import { ListingForm, type ListingFormValues } from '../../../components/listings/listing-form';
import { createListingAction } from '../actions';
import type { AuthSession } from '../../(auth)/auth-actions';

const DEFAULT_VALUES: ListingFormValues = {
  title: '',
  price: '',
  category: '',
  condition: '',
  location: '',
  description: '',
};

export async function getCreateListingPageGuard({ session }: { session: AuthSession | null }): Promise<{ redirectTo: string }> {
  if (session?.user?.id) {
    return { redirectTo: '/listings/new' };
  }

  throw {
    code: 'AUTHENTICATION_REQUIRED',
    redirectTo: '/signin?callbackUrl=%2Flistings%2Fnew',
  };
}

export default function NewListingPage() {
  async function handleSubmit(values: ListingFormValues): Promise<{ redirectTo: string }> {
    'use server';

    const result = await createListingAction({
      session: null,
      input: {
        title: values.title,
        priceCents: Number(values.price) * 100,
        category: values.category,
        condition: values.condition,
        description: values.description,
      },
    });

    return { redirectTo: `/listings/${result.listingId}` };
  }

  return (
    <main className="min-h-screen bg-[#FBF8F2] px-6 py-10 text-[#16151D] lg:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6D627A]">Listing management</p>
          <h1 className="text-4xl font-semibold tracking-tight">Create a listing</h1>
          <p className="max-w-2xl text-sm leading-6 text-[#5B4F6C]">Fill in the visible marketplace fields to publish a new listing and return to the detail view after saving.</p>
        </header>

        <section className="rounded-[28px] border border-[#E7E0D5] bg-white p-6 shadow-[0_22px_70px_rgba(37,24,74,0.08)]">
          <ListingForm defaultValues={DEFAULT_VALUES} submitLabel="Create listing" onSubmit={handleSubmit} />
        </section>
      </div>
    </main>
  );
}
