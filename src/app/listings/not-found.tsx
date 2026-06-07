import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ListingNotFound() {
  return (
    <main className="min-h-screen bg-[#FBF8F2] px-6 py-16 text-[#16151D]">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-[#E7E0D5] bg-white p-8 text-center shadow-[0_24px_70px_rgba(37,24,74,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6D627A]">Catalog</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Listing not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#6D627A]">
          The listing you requested is unavailable or has been removed.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button className="rounded-2xl px-5 py-3">Back to browse</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
