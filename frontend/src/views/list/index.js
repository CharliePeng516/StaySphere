import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Empty, Typography, Image, Flex, Tag, Divider } from 'antd';
import { useNavigate } from "react-router-dom";
// import RateReview from "@/views/list/RateReview";
import { getmyList } from "../mylist/Helper";
import { EnvironmentOutlined, SmileTwoTone } from '@ant-design/icons';
import PublishModal from '../mylist/publishModal.js';
import { getBookings } from '@/api/bookings'

// import AverageRating from '../detailListPage/AverageRating.js';
// import YouTube from 'react-youtube';
import '../mylist/style.scss'
import AverageRating from '../detailListPage/AverageRating.js';
const { Text } = Typography;
const App = ()=>{
    const [refresh, setrefresh] = useState(false);
    const [myList, setmyList] = useState([]);
    const [allBookingList, setBookingList] = useState([])

    useEffect(() => {
      fetchListing();
      localStorage.getItem('token')&&fetchBookingList()
    }, [ refresh ]);
    
    async function fetchListing () {
      const listingsRes = await getmyList();
      const allMyList = listingsRes.filter((listing) => listing.published);
      setmyList(allMyList);
      setrefresh(false);
    }

    const fetchBookingList = async()=>{
      const res = await getBookings()
      if(res){
        let list = res.bookings.filter(item=>item.status === 'accepted').map(item=>`${item.listingId}`)
        console.log('list', list)
        list = Array.from(new Set(list))
        setBookingList(list)
      }

      // getBookings()
      //   .then(res=>{
      //     if(res.bookings){
      //       const data = res.bookings
      //       const currentBookData = data.filter(item=>item.listingId === `${id}`)
      //       const acceptBooking = currentBookData.filter(item=>item.status === 'accepted')
      //       const dateRanges = acceptBooking.map((booking) => booking.dateRange);
      //       console.log(dateRanges)
      //       setCanNotAccept(dateRanges)
      //       setBookings(currentBookData)
      //     }else{
      //       setBookings({})
      //       setCanNotAccept([])
      //     }
    
    }

    

    return(
      <div style={{ marginTop: 20, padding: '0px 30px' }}>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 24}]}>
          {myList.length === 0 && 
            <Col span={24}>
              <Empty description={
                <Text style={{ fontSize: '16px' }}>
                  You have not created any listings yet. Click the &apos;Create
                  New Listing&apos; button to create a new listing.
                </Text>
              }
            />
          </Col>
          }
          {myList.map((listing, key) => (
            <CardColumns
              key={key}
              listing={listing}
              setrefresh={setrefresh}
              allBookingList={allBookingList}
            />
          ))}
        </Row>
      </div>
    )
}


const CardColumns = ({listing={}, setrefresh, allBookingList=[]})=> {
  const listingID = listing.id
  const navigate = useNavigate();
  const navigateTo=()=>{
    navigate(`/listings/${listingID}`)
  }
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState()
  useEffect(()=>{
    if(listing.metadata.youtubeUrl){
      const urls = listing.metadata.youtubeUrl.split('/')
      const videoSuffix = urls[3]
      setYoutubeUrl(videoSuffix)
    }
  },[listing])

  const CoverImageOrVideo = (
    !youtubeUrl ? 
    <Image
      style={{ objectFit: 'cover'}}
      width={'100%'}
      height={210}
      src={listing.thumbnail || ''}
      alt="room picture"
    />:
    // <YouTube videoId="UFdxbgAruzE" opts={videoOpts} onReady={_onReady} />
    <iframe 
      width={'100%'} 
      height="210" 
      src={`https://www.youtube.com/embed/${youtubeUrl}`} 
      title="YouTube video player" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"/>
  )

  return (
    <Col className="gutter-row" xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
      <PublishModal
        setrefresh={setrefresh}
        isModalOpen={isPublishModalOpen}
        setIsModalOpen={setIsPublishModalOpen}
        listingId={listingID}
      />
      <Card
        hoverable
        onClick={() => {navigateTo()}}
        style={{ maxWidth: 370 }}
        //should be a youtube video url component
        cover={ CoverImageOrVideo }
        
      >
        <>
          {/* <Meta title= {listing.title}/> */}
          <div className='card-content__container'>
            <Flex className='rate-line' style={{width: '100%', height: 30}} justify='space-between' align='center'>
              <div className='text'>{listing.metadata?.propertyType}</div>
              <span>
                <AverageRating reviews={listing.reviews}/>
              </span>  
            </Flex>
            <Flex className='title-line' style={{width: '100%', height: 25}} justify='space-between' align='center'>
              <span className='title'>{listing.title||'--'}</span>
              <span className='price'><span style={{ marginRight: 3 }}>$</span>{listing.price}</span>
            </Flex>
            <Flex className='address-line' style={{width: '100%', height: 25}} justify='flex-start' align='center'>
              <span><EnvironmentOutlined style={{ color: '#898e9a' }}/></span>
              <span style={{ marginLeft: 6,color: '#898e9a', fontSize: 12 }}>{ listing.address?.addressLine || '--' }</span>
            </Flex>
            <Flex className='address-line' style={{width: '100%', height: 35}} justify='flex-start' align='center'>
              <Tag>{`${listing.metadata?.numBed} Bed`}</Tag>
              <Tag>{`${listing.metadata?.numBedroom} Bedroom`}</Tag>
              <Tag>{`${listing.metadata?.numBathroom} Bathroom`}</Tag>
            </Flex>
            {
              allBookingList.length && allBookingList.some(item=>item === `${listingID}`)?
              <>
                <Divider></Divider>
                <Flex className='' style={{width: '100%', height: 25}} justify='center' align='center'>
                  <SmileTwoTone /> <div style={{ marginLeft: 6, fontSize: 14 }}>Your Booking has been accepted  🎉🎉🎉</div>
                </Flex>
              </>:
              <></>
            }
            
          </div>
        </>
      </Card>
    </Col>
  )
};

export default App;