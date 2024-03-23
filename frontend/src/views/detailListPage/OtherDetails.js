import React from 'react';
import { Divider, Typography, Card } from 'antd';
import './style.scss';

const OtherDetails = (props) => {
  const { Title, Text } = Typography;

  const { list } = props;
  return (
    <>
      <div>
        <Title level={3} style={{ display: 'inline', marginRight: '20px' }}>
          Property Type:
        </Title>
        <Text style={{ display: 'inline', fontSize: '20px' }} strong='true'>
          {list?.metadata?.propertyType}
        </Text>
      </div>
      <Text
        style={{ fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}
      >
        {`${list?.metadata?.numBedroom} Bedroom(s)`} &#x2022;{' '}
        {`${list?.metadata?.numBed} Bed(s)`} &#x2022;{' '}
        {`${list?.metadata?.numBathroom} Bathroom(s)`}
      </Text>
      <Divider />
      <Title level={3}>What this place offers</Title>
      <div className='amentity'>
        {list?.metadata?.amenities.map((amenity, key) => (
          <Card key={key} size="small" className='amentity_card'>
            <Text sytle={{ fontSize: '16px' }}>{amenity}</Text>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OtherDetails;
