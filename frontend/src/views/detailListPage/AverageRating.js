import React from 'react';
import { Rate, Popover, Progress } from 'antd';
import PropTypes from 'prop-types';

const AverageRating = ({reviews}) => {
  const averageRating = parseFloat(
    (
      reviews?.reduce((acc, cur) => acc + cur.rate, 0) / reviews?.length || 0
    ).toFixed(1)
  );
  
  const ratingDetails = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  reviews?.forEach(review => {
    ratingDetails[review.rate] = (ratingDetails[review.rate] || 0) + 1;
  });

  const totalReviews = reviews?.length || 0;
  const ratePercentages = Object.keys(ratingDetails).map(key => ({
    rate: key,
    percentage: totalReviews > 0 ? ((ratingDetails[key] / totalReviews) * 100).toFixed(1) : Number(0)
  }));
  const popoverContent = <RatingPopoverContent ratePercentages = {ratePercentages}/>;
  return (
    <Popover content={popoverContent} title={`Total Reviews (${totalReviews})`}>
      <Rate allowHalf defaultValue={0} disabled value={averageRating}/>
      <span>{`(${averageRating})`}</span>
    </Popover>
  );
};

const RatingPopoverContent = ({ratePercentages})=>{
  return(
    <div>
      {ratePercentages.map((item) => (
        <div key={item.rate}>
          <span>{`${item.rate} star`}</span>
          <Progress percent={parseFloat(item.percentage)} />
        </div>
      ))}
    </div>
  )
}
AverageRating.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
      listingid: PropTypes.string,
      bookingid: PropTypes.number,
      rate: PropTypes.number,
      comment: PropTypes.string
    })
  ),
};
RatingPopoverContent.propTypes = {
  ratePercentages: PropTypes.arrayOf(
    PropTypes.shape({
      rate: PropTypes.string,
      percentage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  )
};

export default AverageRating;