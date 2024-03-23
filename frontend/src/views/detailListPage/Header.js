import { Button, Typography, Image, Row, Col, Tag, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useRef, useEffect } from 'react';
import { HomeOutlined, EnvironmentOutlined, ShopOutlined,HddOutlined } from '@ant-design/icons';
import PublishModal from '../mylist/publishModal';
import { newBook } from '@/api/bookings'
import { useParams, useNavigate } from 'react-router-dom'
import AvailableDataModal from './AvailableDateModal'
import AverageRating from './AverageRating'
import './Header.scss';
const { Title, Text } = Typography;

const Header = (props) => {

  const { list = {}, availableData, getBookingId } = props;
  // console.log('list:', list)
  const [ metadata, setMetaData] = useState({})
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    if(list && Object.keys(list).length){
      setMetaData(list.metadata)
      if(list.metadata.youtubeUrl){
        const urls = list.metadata.youtubeUrl.split('/')
        const videoSuffix = urls[3]
        setYoutubeUrl(videoSuffix)
      }
    }else{
      setMetaData({})
    }
  },[list])
  
  const { id } = useParams()
  const dialogRef = useRef(null)
  const address = `${list?.address?.addressLine}, ${list?.address?.city}, ${list?.address?.state}, ${list?.address?.country}`;

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [open, setOpen] = useState(false)
  useEffect(()=>{
    console.log('refresh')
  },[refresh])

  const canNotBook = ()=>{
    const isLogin = localStorage.getItem('email') 
    const isOwner = localStorage.getItem('email') && localStorage.getItem('email') === list.owner
    return !isLogin || isOwner
  }
  const onCreate = (values)=>{
    const dateRange = {
      start: dayjs(values.aDateRange[0]).format('DD/MM/YYYY'),
      end: dayjs(values.aDateRange[1]).format('DD/MM/YYYY')
    }
    //caculate total price
    const diff = dayjs(values.aDateRange[1]).diff(dayjs(values.aDateRange[0]), 'day')
    const totalPrice = Number(diff * list.price)

    newBook({
      id,
      dateRange,
      totalPrice: totalPrice
    }).then(res=>{
      setOpen(false)
      if(res && res.bookingId){
        message.success('Congratulations! You have already book successfully')
        // refresh page
        navigate(`/listings/${id}`)
        getBookingId(res.bookingId)
      }
    })
  }

  return (
    <div className=''>
      <div className='detail__main-info'>
        <Row gutter={[24, 40]}>
          <Col span={24}>
            <div className='image__container'>
              {
                !youtubeUrl?
                <Image
                  width={'98%'}
                  height={360}
                  style={{ objectFit: 'cover', borderRadius: 20}}
                  src={list.thumbnail}
                  alt="room picture"
                  preview={false}
                />:
                <iframe width={'98%'} height="340" src={`https://www.youtube.com/embed/${youtubeUrl}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              }
          </div>
          </Col>
        </Row>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <div className='room-desc__container'>
              <Title level={2}>{list.title || '--'}</Title> 
              <div className='address'>
                <span><EnvironmentOutlined style={{ color: '#898e9a' }}/></span>
                <span>{ address || '--' }</span>
              </div>
              <div className='general-info'>
                <div>
                  <Tag icon={<HomeOutlined />}>
                    { metadata.propertyType || '--' }
                  </Tag>
                  <Tag icon={<ShopOutlined />}>
                    { metadata.numBedroom || '--' } Bedroom
                  </Tag>
                  <Tag icon={<HddOutlined />}>
                    { metadata.numBathroom || '--' } Bath
                  </Tag>
                </div>
                <span className='price'><span style={{color: '#6c7484', marginRight: 6 }}>price:</span>${list.price || '--'}</span>
              </div>
              <div className='' style={{ color: '#6c7484', marginBottom: 18, marginLeft: 6}}>
                {metadata?.bedroomDetails}
              </div>
              <div className='review__container'>
                {/* <Rate character={<HeartOutlined />} allowHalf /> */}
                <span>
                  <AverageRating reviews = {list.reviews}/>
                </span>
              </div>
              <div className='book-btn'>
                { localStorage.getItem('email')? <Button
                  name="bookBtn"
                  className='header_Info_bootBtn'
                  type="primary"
                  disabled={canNotBook()}
                  onClick={()=>setOpen(true)}
                >
                  Book
                </Button>: <Text>Login to book</Text>}
                
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <AvailableDataModal
        availableData={availableData}
        open={open}
        onCreate={onCreate}
        onCancel={() => {setOpen(false)}}
      />
      <PublishModal
        setrefresh={()=>setrefresh(false)}
        isModalOpen={isPublishModalOpen}
        setIsModalOpen={setIsPublishModalOpen}
        listingId={id}
        totalPrice={list.price || 0}
        forwardRef={dialogRef}
        type="book"
      />
    </div>
  );
};

export default Header;
