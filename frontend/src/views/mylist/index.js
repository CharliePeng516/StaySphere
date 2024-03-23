import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Empty, Typography, message, Image, Flex, Tag, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
// import RateReview from "@/views/list/RateReview";
import { getmyList } from "./Helper.js";
import { PlusCircleOutlined, EnvironmentOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { deleteList, unpublishList} from "@/api/listings";
import PublishModal from './publishModal.js';
import AverageRating from '../detailListPage/AverageRating.js';
import {useSelector} from "react-redux";
import './style.scss';
const { Text } = Typography;
const { confirm } = Modal;

const App = ()=>{
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const { searchParams } = useSelector((store) => store.search);


    const createList=()=>{
        navigate("/create-myairbrb")
    }
    const [refresh, setrefresh] = useState(false);
    const [myList, setmyList] = useState([]);

    useEffect(() => {
      fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ refresh ]);

    useEffect(()=>{
      console.log('searchParams', searchParams)
      // fetchListing();
      const param = Object.keys(searchParams)[0]
      if(searchParams[param]){
        // eslint-disable-next-line array-callback-return
        let list = myList.filter((listing) => {
          if(param === 'address'){
            return listing['address'].addressLine.indexOf(searchParams[param]) > -1
          }else if(param !== 'title'){
            Object.keys(listing[param]).some(item => {
              return listing[param][item].indexOf(searchParams[param]) >- 1
            })
          }else{
            return listing[param].includes(searchParams[param])
          }
        });
        setmyList(list)
      }else{
      fetchListing()

      }
      //eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams])
    
    async function fetchListing () {
      const listingsRes = await getmyList();
      const allMyList = listingsRes.filter((listing) => listing.owner === email);
      setmyList(allMyList);
      setrefresh(false);
    }

    return(
      <div>
        <div className="header">
          <Flex style={{ width: '100%', height: 20}} justify='flex-end' align='center'>
            <Button 
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={createList}
              name='createNewListing'
            >
              Create Listing
            </Button>
          </Flex>
        </div>
        <div style={{ padding: '0px 30px'}}>
          <Row gutter={[30, 30]}>
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
              />
            ))}
          </Row>
        </div>
      </div>
    )
}


const CardColumns = ({listing={}, setrefresh})=> {
  const listingID = listing.id
  // totalReviews
  // const totalReviews = listing.reviews.length;
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

  //delete list by id
  const deleteListbyID = async (id) => {
    const res = await deleteList(id);
    if (res) {
      message.success('Listing deleted successfully!');
      setrefresh(true);
    } else {
      message.error('Listing deleted failed!');
    }
  }

  //edit list by id
  const editList = async (id) => {
    navigate(`/edit-myairbrb/${id}`)
  }

  //unpublish list by id
  const unpublishListbyId = async (id) => {
    const res = await unpublishList(id);
    if (res){
      message.success('Listing unpublished successfully!');
      setrefresh(true);
    } else {
      message.error('Listing unpublished failed!');
    }
  }

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

  const CardActionsForOwner = [
    <Button
      name="publishBtn"
      style={{ border: 'transparent', backgroundColor: 'transparent' }}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        listing.published ? 
        unpublishListbyId(listingID) :
        setIsPublishModalOpen(true)
      }}
    >
      {listing.published ? 'Unpublish' : 'Publish'}
    </Button>
    ,
    <Button
      name="editBtn"
      style={{ border: 'transparent', backgroundColor: 'transparent' }}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        editList(listingID);
      }}
    >
      Edit
    </Button>,
    <Button
      style={{ border: 'transparent', backgroundColor: 'transparent' }}
      size="small"
      name="bookingBtn"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/myairbrb/bookings/${listing.id}`)
      }}
    >
      Booking
    </Button>,
    <Button
      style={{ border: 'transparent', backgroundColor: 'transparent' }}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        showDeleteConfirm()
        //deleteListbyID(listingID)
      }}>Delete
    </Button>,
  ]

  const showDeleteConfirm = ()=>{
    confirm({
      title: 'Delete Listing?',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure delete this listing?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteListbyID(listingID)
      },
      onCancel() {
        
      },
    });
  }

  return (
    <Col className="gutter-row" xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
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
        actions={CardActionsForOwner}
      >
        <>
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
            
          </div>
        </>
      </Card>
    </Col>
  )
};

export default App;