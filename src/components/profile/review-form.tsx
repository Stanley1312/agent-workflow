import type { FormHTMLAttributes } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

export type ReviewFormState = {
  rating?: number;
  content?: string;
  errors?: {
    rating?: string;
    content?: string;
    form?: string;
  };
};

export type ReviewFormProps = FormHTMLAttributes<HTMLFormElement> & {
  profileId: string;
  state?: ReviewFormState;
};

const MIN_RATING = 1;
const MAX_RATING = 5;

export function ReviewForm({ profileId, state, className = '', ...props }: ReviewFormProps) {
  const ratingValue = state?.rating?.toString() ?? '';
  const contentValue = state?.content ?? '';
  const hasRatingError = Boolean(state?.errors?.rating);
  const hasContentError = Boolean(state?.errors?.content);

  return (
    <form
      className={[
        'rounded-[16px] border border-[#E7E3DA] bg-white p-6 shadow-[0_1px_2px_rgba(17,15,23,0.06)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <input type="hidden" name="profileId" value={profileId} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#17151F]">Leave a review</h2>
          <p className="mt-1 text-sm text-[#6B6774]">Share your experience and help others evaluate this seller.</p>
        </div>
      </div>

      {state?.errors?.form ? (
        <p className="mt-4 rounded-[12px] border border-[#F2B8B5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]" role="alert">
          {state.errors.form}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2 text-sm font-medium text-[#17151F]">
          <label htmlFor="rating">Rating</label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={MIN_RATING}
            max={MAX_RATING}
            step="1"
            defaultValue={ratingValue}
            aria-invalid={hasRatingError}
            aria-describedby={hasRatingError ? 'rating-error' : 'rating-help'}
          />
        </div>
        {hasRatingError ? (
          <p id="rating-error" className="-mt-2 text-sm text-[#DC2626]" role="alert">
            {state?.errors?.rating}
          </p>
        ) : null}
        <p id="rating-help" className="-mt-2 text-xs text-[#6B6774]">
          Allowed range: 1 to 5.
        </p>

        <div className="grid gap-2 text-sm font-medium text-[#17151F]">
          <label htmlFor="content">Review</label>
          <textarea
            id="content"
            name="content"
            rows={5}
            defaultValue={contentValue}
            aria-invalid={hasContentError}
            aria-describedby={hasContentError ? 'content-error' : 'content-help'}
            className="min-h-[120px] w-full rounded-xl border border-[#DCCFC0] bg-white px-4 py-3 text-sm text-[#16151D] shadow-sm transition-colors placeholder:text-[#9A8FA3] focus:border-[#B995E8] focus:outline-none focus:ring-2 focus:ring-[#B995E8]/30"
            placeholder="Write about communication, condition, shipping, and overall experience"
          />
        </div>
        {hasContentError ? (
          <p id="content-error" className="-mt-2 text-sm text-[#DC2626]" role="alert">
            {state?.errors?.content}
          </p>
        ) : null}
        <p id="content-help" className="-mt-2 text-xs text-[#6B6774]">Reviews must be concise, helpful, and under 2000 characters.</p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="secondary" type="reset">
          Clear
        </Button>
        <Button type="submit">Submit review</Button>
      </div>
    </form>
  );
}
