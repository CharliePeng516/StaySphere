import { useParams } from "react-router-dom";
import React, { useEffect, useState} from "react"
import GoogleMapReact from 'google-map-react';
import { Typography, Row, Col, Divider, Space, Tag, Tooltip, Flex, Card, Modal, message, Empty} from 'antd';
import Icon, { FormOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { getListById, addNewReview } from "@/api/listings";
import { getBookings, deleteBooking } from '@/api/bookings'
import Header from './Header';
import { DEFAULT_MAP_PARAMS } from '@/constants'
import ReviewModal from './ReviewModal'
import RateReview from "@/views/list/RateReview";
// import axios from 'axios'
// import dayjs from 'dayjs'
// import OtherDetails from './OtherDetails';
import PandaSvg from './pandaSvg'
import './style.scss';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Meta } = Card;
const AnyReactComponent = ({ text }) => <div>{text}</div>;
const PandaIcon = (props) => <Icon component={PandaSvg} {...props} />
const App = ()=>{
    const { id } = useParams();
    // const navigate = useNavigate()
    const [listDetail, setListDetail] = useState({});
    const [features, setFeatures] = useState([])
    const [open, setOpen] = useState(false);
    const email = localStorage.getItem('email');
    const [bookList, setBookList] = useState([])
    const [aDate, setDate] = useState([])
    const [bookingId, setBookingId] = useState(null)
    const [cardData, setCardData] = useState({})
    // const [dynamicGis, setDynamicGis] = useState(DEFAULT_MAP_PARAMS.LOCATION)
    const isOwnListing = email === listDetail.owner
    useEffect(() => {
      fetchListing();
      localStorage.getItem('token')&&fetchBooking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId]);

    const fetchListing = async()=>{
      const res = await getListById(id);
      const list = res.listing? res.listing : {}
      // fetchGisLocation(list?.address)
      setListDetail(list);
      if(list.metadata && list.metadata.amenities){
        setFeatures(list.metadata.amenities)
      }
    }
    const fetchBooking = async()=>{
      const res = await getBookings()
      if(res && res.bookings){
        const dataRange = res.bookings.map(item=>item.dateRange)
        setDate(dataRange)
        let currentUserBookings = []
        res.bookings.forEach(({owner,listingId,...params})=> {
          if(owner === localStorage.getItem('email') && listingId === id){
            currentUserBookings.push({
              ...params,
              end: params.dateRange?.end,
              start: params.dateRange?.start,
            }) 
          }
        })
        // console.log('currentUserBookings', currentUserBookings)
        setBookList(currentUserBookings || [])
      }
    }

    // set google map in Sydney
    const defaultProps = {
      center: DEFAULT_MAP_PARAMS.LOCATION,
      zoom: DEFAULT_MAP_PARAMS.ZOOM
    };

    const onCreate = (values) => {
      console.log('Received values of form: ', values);
      console.log('card data1: ', cardData);
      addNewReview({
        user: localStorage.getItem('email'),
        listingid: id,
        bookingid: cardData?.id,
        ...values
      })
      .then(res=>{
        if(res && !res.error){
          message.success('Congratulations! You have already submitted this review!')
          fetchListing();
          fetchBooking()
          // navigate(`/listings/${id}`)
        }
      })
      setOpen(false);
    };

    const getBookingId = id => setBookingId(id)

    const showDeleteConfirm = data =>{
      confirm({
        title: 'Delete booking?',
        icon: <ExclamationCircleFilled />,
        content: 'Are you sure delete this booking?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          confirmDelete(data)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    const confirmDelete = (data)=>{
      deleteBooking(data.id).then(res=>{
        if(!res.error){
          message.success('Congratulations! You have already successfully deleted this booking!')
          setBookingId(null)
          fetchListing();
          fetchBooking()
          // navigate(`/listings/${id}`)
        }
      })
    }

    const handleAddReview = data =>{
      setCardData({...data})
      console.log('setCardData', {...data},cardData)
      setOpen(true)
    }

    // const fetchGisLocation = async ({addressLine, city, state})=>{
    //   const address = `${addressLine},+${city},+${state}`.replace(/\s+/g, '+')
    //   try {
    //     // const res = await getGisLocation(address)
    //     // if(res?.data?.results&&res.data.results.length){
    //     //   debugger
    //     //   setDynamicGis(res.data.results[0]?.geometry?.location)
    //     // } 
    //   } catch (err) {
    //     console.log(err);
    //     return err;
    //   }   
    // }

    return(
      <div className="detail-page__container" style={{ backgroundColor: '#f0f2f5'}}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={10} xxl={10}>
            <Header
              list={listDetail}
              isOwnListing={isOwnListing}
              setListDetail={setListDetail}
              availableData={aDate}
              getBookingId={getBookingId}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={14} xxl={14}>
            <div style={{width: '100%'}} className="right-detail__container">
              <Title level={3}>Property Details</Title> 
              <div className="property-type__container">
                <div>{listDetail?.metadata?.numBedroom} Bedroom(s) • {listDetail?.metadata?.numBed} Bed(s) • {listDetail?.metadata?.numBathroom} Bathroom(s)</div>
                <div>{`Room details: ${listDetail?.metadata?.bedroomDetails}`}</div>
              </div>
              <Divider></Divider>
              <Title level={3}>Property features</Title> 
              <div className="features__container">
                <Space size={[0, 8]} wrap>
                  {features.map(item=>(<Tag key={item}>{item}</Tag>))}
                </Space>
              </div>
              <Divider></Divider>
              <Title level={3}>Your Bookings</Title>
              <div className="booking-record__container">
                <Row gutter={[24, 32]}>
                  {
                    bookList.length?bookList.map(item=>(
                      <Col span={8} key={item.id}>
                        <Card actions={item.status !== 'accepted' ? [<Tooltip title="Delete this booking"><DeleteOutlined /><span style={{ marginLeft: 6}} onClick={()=>showDeleteConfirm(item)}>Delete this booking</span></Tooltip>]:
                        [<Tooltip title="Add a new review"><FormOutlined/><span name="addReview" style={{ marginLeft: 6}} onClick={()=>handleAddReview(item)}>Add a new review</span></Tooltip>]
                      }>
                          <Meta
                            avatar={<PandaIcon/>}
                            title={<div>Booking Stutas:<span style={{marginLeft: 6, color: '#2d6be5', fontSize: 16, fontWeight: 600}}>{item.status.toUpperCase()}</span></div>}
                            description={
                              <>
                                <div style={{ marginBottom: 6}}><span style={{ fontWeight: 600, marginRight: 6}}>Date:</span>{item.start}-{item.end}</div>
                                <div><span style={{ fontWeight: 600, marginRight: 6 }}>Total Price:</span><span style={{ color: '#2d6be5', fontSize: 16, fontWeight: 600}}>{item.totalPrice}$</span></div>
                              </>
                            }
                          />
                        </Card>
                      </Col>
                    )): <div style={{ textAlign: 'center', width: '100%'}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                  }
                  
                </Row>
              </div>
              <Divider/>
              <Title level={3}>Location</Title>
              <div style={{ height: '500px', width: '90%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyDMXjJznvuGcgU_qarIRFQKcee7kcAKtBU" }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                >
                  <AnyReactComponent
                    {...DEFAULT_MAP_PARAMS.LOCATION}
                    text="Location Map"
                  />
                </GoogleMapReact>
              </div>
              <Divider/>
              
              <Flex style={{ marginTop: 10 }} justify='space-between' align='center'>
                <Title level={3}>Reviews</Title>
                <ReviewModal
                  open={open}
                  onCreate={onCreate}
                  onCancel={() => {setOpen(false)}}
                />
              </Flex>
              <div>
                {
                  listDetail.reviews && listDetail.reviews.length?
                  listDetail.reviews.map((review, key)=>
                  <Card key = {key}>
                    <Meta
                      avatar={<PandaIcon/>}
                      style={{ marginBottom: 6}}
                      description={
                        <>
                          <Title level={5}>{review.user}</Title>
                          <Text style={{ fontSize: '16px'}}>{review.comment}</Text>
                        </>
                      }
                    />
                    <RateReview review={review}/>
                  </Card>
                  )
                  :<Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 60,
                  }}
                  description={
                    <span>
                      No comments have been received yet 
                    </span>
                  }
                >
                </Empty>
                }
                
              </div>
            </div>
          </Col>
        </Row>
          
        {/* {loggedIn && !isOwnListing && (
          <div className='container_inner_booking'>
            <Title level={3}>Your Bookings</Title>
              <Text style={{ fontSize: '16px' }}>
                You haven't made any bookings on this listing
              </Text>
            <Divider />
          </div>
        )}
        <OtherDetails list={listDetail} />
        <Divider /> */}

      </div>
    );
}

export default App;