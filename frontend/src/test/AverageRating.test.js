import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AverageRating from '../views/detailListPage/AverageRating'; 
import { act } from 'react-dom/test-utils';

// Review Data in the database
//  "reviews": [
//   {
//     "user": "Alex@gmail.com",
//     "listingid": "913432724",
//     "bookingid": 136415560,
//     "rate": 4,
//     "comment": "good house"
//   }
// ],

describe('AverageRating Component', () => {
  it('should display all 0% for empty reviews', async () => {
    render(<AverageRating reviews={[]} />);
    
    await act(async () => {
      const rateComponent = screen.getByRole('radiogroup');
      userEvent.hover(rateComponent);
    });
    
    const popoverTitle = await screen.findByText('Total Reviews (0)');
    expect(popoverTitle).toBeInTheDocument();
    
    await screen.findAllByText('0%').then((elements) => {
      expect(elements.length).toBe(5); // Expect five 0% elements
    });
  });

  it('should display 100% for a single rate when all reviews are the same', async () => {
    const reviews = Array(5).fill({ rate: 4 }); // Five reviews with a rate of 4
    render(<AverageRating reviews={reviews} />);
    
    await act(async () => {
      const rateComponent = screen.getByRole('radiogroup');
      userEvent.hover(rateComponent);
    });
    
    const popoverTitle = await screen.findByText('Total Reviews (5)');
    expect(popoverTitle).toBeInTheDocument();
    
    await screen.findAllByText('0%').then((elements) => {
      expect(elements.length).toBe(4); // Expect four 0% elements
    });
  });

  it('should display correct percentages for mixed reviews', async () => {
    const reviews = [
      { rate: 3 },
      { rate: 3 },
      { rate: 5 },
    ];
  
    const ratePercentages = calculatePercentage(reviews);
  
    render(<AverageRating reviews={reviews} />);
    
    await act(async () => {
      const rateComponent = screen.getByRole('radiogroup');
      userEvent.hover(rateComponent);
    });
    
    const popoverTitle = await screen.findByText(`Total Reviews (${reviews.length})`);
    expect(popoverTitle).toBeInTheDocument();

    ratePercentages.forEach(async (item) => {
      const percentageText = `${item.percentage}%`;
      const percentageElement = await screen.findByText(percentageText);
      expect(percentageElement).toBeInTheDocument();
      expect(percentageElement).toHaveTextContent(percentageText);
    });
  });

});


const calculatePercentage = (reviews) => {
  const ratingDetails = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  reviews?.forEach(review => {
    ratingDetails[review.rate] = (ratingDetails[review.rate] || 0) + 1;
  });

  const totalReviews = reviews?.length || 0;
  const ratePercentages = Object.keys(ratingDetails).map(key => ({
    rate: key,
    percentage: totalReviews > 0 ? ((ratingDetails[key] / totalReviews) * 100).toFixed(1) : Number(0)
  }));
  return ratePercentages;
}