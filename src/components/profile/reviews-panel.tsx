import type { ReactNode } from 'react';

import { Button } from '../ui/button';

export type ProfileReview = {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAtLabel?: string;
};

export type ReviewsPanelProps = {
  reviews: ProfileReview[];
  averageRating: number;
  reviewCount: number;
  activeTab?: boolean;
  action?: ReactNode;
};

function formatAverageRating(averageRating: number): string {
  if (!Number.isFinite(averageRating)) {
    return '0.0';
  }

  return averageRating.toFixed(1);
}

function RatingStars({ rating }: { rating: number }): ReactNode {
  return (
    <div aria-label={`${rating} out of 5 stars`} className="flex gap-1 text-[#F59E0B]">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function ReviewsPanel({ reviews, averageRating, reviewCount, activeTab = true, action }: ReviewsPanelProps) {
  return (
    <section
      aria-label="Profile reviews"
      className={[
        'rounded-[24px] border border-[#E7E3DA] bg-white p-6 shadow-[0_1px_2px_rgba(17,15,23,0.06)]',
        activeTab ? '' : 'hidden',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-extrabold text-[#17151F]">Reviews</h2>
          <p className="mt-1 text-sm text-[#6B6774]">
            {reviewCount > 0 ? `${formatAverageRating(averageRating)} average from ${reviewCount} reviews` : 'No reviews yet'}
          </p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>

      <div className="mt-6 grid gap-4 rounded-[20px] bg-[#F7F6F3] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[#17151F]">Rating summary</span>
          <span className="text-sm text-[#6B6774]">{reviewCount} total</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[32px] font-extrabold text-[#17151F]">{formatAverageRating(averageRating)}</span>
          <RatingStars rating={Math.round(averageRating)} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review.id} className="rounded-[16px] border border-[#E7E3DA] bg-white p-4 shadow-[0_1px_2px_rgba(17,15,23,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#17151F]">{review.authorName}</h3>
                  <p className="text-xs text-[#6B6774]">{review.createdAtLabel ?? 'Recently posted'}</p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#17151F]">{review.content}</p>
            </article>
          ))
        ) : (
          <div className="rounded-[16px] border border-dashed border-[#DCCFC0] bg-[#F7F6F3] p-6 text-center">
            <p className="text-sm font-semibold text-[#17151F]">No reviews yet</p>
            <p className="mt-1 text-sm text-[#6B6774]">This profile has not received any reviews. Ratings will appear here once a review is submitted.</p>
            <div className="mt-4 flex justify-center">
              <Button variant="secondary" aria-label="Write the first review">Write a review</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
