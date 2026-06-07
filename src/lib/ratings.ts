const MIN_RATING = 1;
const MAX_RATING = 5;

export interface RatingAggregate {
  averageRating: number;
  reviewCount: number;
}

export function createEmptyRatingAggregate(): RatingAggregate {
  return {
    averageRating: 0,
    reviewCount: 0,
  };
}

export function calculateRatingSummary(reviews: Array<{ rating: number }>): RatingAggregate {
  if (reviews.length === 0) {
    return createEmptyRatingAggregate();
  }

  const totalRating = reviews.reduce((sum, review) => {
    if (review.rating < MIN_RATING || review.rating > MAX_RATING) {
      throw new RangeError('Rating must be between 1 and 5');
    }

    return sum + review.rating;
  }, 0);

  return {
    reviewCount: reviews.length,
    averageRating: totalRating / reviews.length,
  };
}

export function updateRatingAggregate(existingReviews: Array<{ rating: number }>): RatingAggregate {
  return calculateRatingSummary(existingReviews);
}
