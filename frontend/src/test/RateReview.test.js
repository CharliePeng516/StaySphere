import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RateReview from '../views/list/RateReview';

describe('RateReview Component', () => {
  it('should display the correct rating based on the review', () => {
    const review = {
      user: "user@example.com",
      listingid: "listing123",
      bookingid: 123,
      rate: 3,
      comment: "This is a comment"
    };

    render(<RateReview review={review} />);
    const rateGroup = screen.getByRole('radiogroup');
    const activeStars = Array.from(rateGroup.querySelectorAll('.ant-rate-star.ant-rate-star-full'));
    expect(activeStars).toHaveLength(review.rate);
  });

  it('should display no rating if the review rate is not provided', () => {
    const review = {};
    render(<RateReview review={review} />);
    const rateGroup = screen.getByRole('radiogroup');
    const activeStars = Array.from(rateGroup.querySelectorAll('.ant-rate-star.ant-rate-star-full'));
    expect(activeStars).toHaveLength(0)
  });
});