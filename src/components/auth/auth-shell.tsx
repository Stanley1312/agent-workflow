import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export type AuthShellProps = {
  brandActionLabel: string;
  brandActionHref: string;
  brandActionText: string;
  eyebrow: string;
  headline: string;
  description: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialMeta: string;
  children: ReactNode;
};

export function AuthShell({
  brandActionLabel,
  brandActionHref,
  brandActionText,
  eyebrow,
  headline,
  description,
  testimonialQuote,
  testimonialAuthor,
  testimonialMeta,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#17151F]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-[#E7E3DA] bg-white px-6 py-3 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#6F3CC3] text-sm font-bold text-white shadow-sm">
            M
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-[#16151D]">MatchMarket</div>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-[#6B6774] lg:hidden">
              {eyebrow}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#6B6774]">
          <span className="hidden sm:inline">{brandActionLabel}</span>
          <a href={brandActionHref}>
            <Button variant="secondary" className="h-10 rounded-full border-[#E7E3DA] bg-white px-4 text-sm font-semibold text-[#16151D] shadow-sm hover:bg-[#F7F6F3]">
              {brandActionText}
            </Button>
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-10 lg:py-10">
        <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#7B3FE4_0%,#5A25C8_100%)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(111,60,195,0.24)] lg:min-h-[760px] lg:px-12 lg:py-14">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.42)_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -right-16 top-16 h-64 w-64 rounded-full border border-white/20" />
          <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute right-10 top-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
            Trusted local marketplace
          </div>

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-6 pt-10 lg:pt-4">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
                MatchMarket
              </div>
              <p className="max-w-xl text-4xl font-extrabold leading-tight lg:text-[56px]">{headline}</p>
              <p className="max-w-lg text-base leading-7 text-white/82">{description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">24h</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/72">Fast responses</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">1k+</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/72">Local listings</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">4.9</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/72">Average rating</div>
              </div>
            </div>

            <div className="max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm shadow-[0_16px_48px_rgba(111,60,195,0.24)]">
              <p className="text-sm leading-6 text-white/92">{testimonialQuote}</p>
              <div className="mt-4 text-sm font-semibold">{testimonialAuthor}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/70">{testimonialMeta}</div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-2 lg:py-0">
          {children}
        </section>
      </main>
    </div>
  );
}
