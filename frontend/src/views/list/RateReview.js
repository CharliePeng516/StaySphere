import React, { useEffect, useState} from 'react';
import { Rate, Flex } from 'antd';
import PropTypes from 'prop-types';

const RateReview = ({review}) => {
  const [value, setValue] = useState(0);
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  useEffect(()=>{
    if(review.rate){
      console.log('review', review)
      setValue(review.rate)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Flex align='center' style={{marginLeft: 28}}>
      <Rate tooltips={desc} onChange={setValue} disabled value={value} />
      <span></span>
    </Flex>
  );
};
RateReview.propTypes = {
  review: PropTypes.shape({
    user: PropTypes.string,
    listingid: PropTypes.string,
    bookingid: PropTypes.number,
    rate: PropTypes.number,
    comment: PropTypes.string
  }),
};
export default RateReview;