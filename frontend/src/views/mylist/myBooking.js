import React, { useEffect, useState} from 'react';
import { Descriptions, Typography, Card, Button, message, Divider } from 'antd';
import { getBookings, acceptBooking, rejectBooking } from '@/api/bookings'
import { getListById } from '@/api/listings'
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs'
import ProfitChart from './ProfitChart'
import './style.scss'

const { Title } = Typography;

const BookingDetail = () => {

  const { id } = useParams()

  const [listData, setListData] = useState({})
  const [bookings , setBookings] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [canNotAccept , setCanNotAccept] = useState([])

  useEffect(()=>{
    getListById(id)
    .then(res=>{
      const data = res?.listing
      if(data && Object.keys(data).length){
        setListData(data)
      }
    })
    getBookings()
    .then(res=>{
      if(res.bookings){
        const data = res.bookings
        const currentBookData = data.filter(item=>item.listingId === `${id}`)
        const acceptBooking = currentBookData.filter(item=>item.status === 'accepted')
        const dateRanges = acceptBooking.map((booking) => booking.dateRange);
        console.log(dateRanges)
        setCanNotAccept(dateRanges)
        setBookings(currentBookData)
      }else{
        setBookings({})
        setCanNotAccept([])
      }
    });
    setRefresh(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ refresh ])

  let onlineDays;
  if(listData?.postedOn === null){
    onlineDays = 0;
  }else{
    onlineDays =  dayjs().diff(dayjs(listData?.postedOn), 'day')
  }
  const acceptBookingData = bookings.filter(item=>item.status === 'accepted')
  const pendingBookData = bookings.filter(item=>item.status === 'pending')
  const historyBookData = bookings.filter(item=>item.status !== 'pending')
  const address = `${listData?.address?.addressLine}, ${listData?.address?.city}, ${listData?.address?.state}, ${listData?.address?.country}`;

  const getDaysBookedThisYear = () => {
    const currentYear = dayjs().year()
    const dateRanges = acceptBookingData.map((booking) => booking.dateRange);
    const totalDays = dateRanges
      .filter(range => dayjs(range.start, 'DD/MM/YYYY').year() === currentYear)
      .map(range => {
        let startDate = dayjs(range.start, 'DD/MM/YYYY');
        let endDate = dayjs(range.end, 'DD/MM/YYYY');
        return endDate.diff(startDate, 'day');
      })
      .reduce((sum, current) => sum + current, 0);
    return totalDays;
  }

  const getProfitMadeThisYear = () => {
    const numAcceptedBookings = getDaysBookedThisYear();
    return (numAcceptedBookings) * listData.price;
  };

  const profitMadeThisYear = getProfitMadeThisYear();
  const daysBookedThisYear = getDaysBookedThisYear()


  return (
    <div>
      <Title level={2}>{listData.title||''}</Title>
      <Divider>
        <Title level={3}>Listing infomation</Title>
      </Divider>
      
      <Descriptions
        labelStyle={{ fontSize: '16px', fontWeight: 700 }}
        contentStyle={{ fontSize: '16px' }}
      >
        <Descriptions.Item label="Owner">{listData.owner || ''}</Descriptions.Item>
        <Descriptions.Item label="Price per night">{`$${listData.price} USD`}</Descriptions.Item>
        <Descriptions.Item label="Address">{`${address||''}`}</Descriptions.Item>
        <Descriptions.Item label="Published">
          {listData?.published?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Been online for">{`${onlineDays} days`}</Descriptions.Item>
        <Descriptions.Item label="Days booked this year">
          {daysBookedThisYear}
        </Descriptions.Item>
        <Descriptions.Item label="Profits this year">
          {`$${profitMadeThisYear}`}
        </Descriptions.Item>
      </Descriptions>

      <div className='chart_container'>
        <ProfitChart bookings = {bookings}/>
      </div>
      
      <Divider>
        <Title level={3}>{'Pending Booking Information'}</Title>
      </Divider>
        {pendingBookData.map((bookings, key) => (
          <BookingCard
            key={key}
            bookings={bookings}
            setRefresh = {setRefresh}
            bookingstype={'pending'}
            canNotAccept = {canNotAccept}
          />
        ))}
      <div> {pendingBookData.length === 0? 'No upcoming bookings to deal with': null} </div>
      <Divider>
        <Title level={3}>{'Booking Histories'}</Title>
      </Divider>

        {historyBookData.map((bookings, key) => (
            <BookingCard
              key={key}
              bookings={bookings}
              setRefresh = {setRefresh}
              bookingstype={'history'}
            />
          ))}
      <div> {historyBookData.length === 0? 'No booking history': null} </div>
    </div>
  );
};


const BookingCard = ({bookingstype, bookings, setRefresh, canNotAccept}) => {

  const acceptBookingById = async (id) => {
    // check if the booking time conflict with other accepted bookings
    let canAccept = true
    canNotAccept.forEach((dateRange)=>{ 
      const startDate = dayjs(dateRange.start, "DD/MM/YYYY");
      const endDate = dayjs(dateRange.end, "DD/MM/YYYY");
      const bookingStartDate = dayjs(bookings.dateRange.start, "DD/MM/YYYY");
      const bookingEndDate = dayjs(bookings.dateRange.end, "DD/MM/YYYY");
      if (bookingStartDate.isBefore(endDate) && bookingEndDate.isAfter(startDate)) {
        canAccept = false
      }
    })
    if(canAccept){
      const res = await acceptBooking(id);
      if(res){
        message.success('Booking accepted successfully');
        setRefresh(true);
      }
    }else{
      message.error('You can not accept this booking because of time conflict')
      return
    }
  };

  const rejectBookingById = async (id) => {
    const res = await rejectBooking(id);
    if(res){
      message.success('Booking rejected successfully');
      setRefresh(true);
    }
  }

  const cardActions = bookingstype !== 'history' ? [
    <Button
      style={{
        border: 'transparent',
        backgroundColor: 'transparent',
      }}
      name='acceptBooking'
      size="small"
      onClick={() => acceptBookingById(bookings.id)}
    >
      Accept
    </Button>,
    <Button
      style={{
        border: 'transparent',
        backgroundColor: 'transparent',
      }}
      size="small"
      onClick={() => rejectBookingById(bookings.id)}
    >
      Reject
    </Button>
  ] : [];
  

  return(
    <Card
      hoverable={true}
      actions={cardActions}
      className='booking-card'
    >
      <Descriptions
        labelStyle={{ fontSize: '16px', fontWeight: 700 }}
        contentStyle={{ fontSize: '16px' }}
      >
        <Descriptions.Item label="Starts on">
          {bookings.dateRange.start}
        </Descriptions.Item>
        <Descriptions.Item label="Ends on">
          {bookings.dateRange.end}
        </Descriptions.Item>
        <Descriptions.Item label="Total Price">
          {`$${bookings.totalPrice} USD`}
        </Descriptions.Item>
        <Descriptions.Item label="Booking status">
          {`${bookings.status}`}
        </Descriptions.Item>
      </Descriptions>
  </Card>
  );
}

export default BookingDetail;