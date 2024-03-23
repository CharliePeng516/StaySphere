/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState} from 'react';
import {useParams } from "react-router-dom";
import { Button, Form, Input,Select, message,InputNumber, Upload, Modal, Row, Col, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate} from "react-router-dom";
import { editList, getListById } from "@/api/listings";
import './style.scss';
const { TextArea } = Input;
const App = ()=>{
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const navigateToPrev = ()=>{
    navigate("/myairbrb")
  }

  const [listDetail, setListDetail] = useState([]);
  const [editMetadata, setMetadata] = useState([]);
  const [fileList, setFileList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    fetchListing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchListing =async()=> {
    const res = await getListById(id);
    const list = res.listing
    const metadata = list.metadata
    const address = list.address || {}
    setListDetail(list);
    setMetadata(metadata);
    // set form data
    if(list && metadata){
      form.setFieldsValue({
        title: list.title,
        addressLine: address?.addressLine,
        city: address?.city,
        state: address?.state,
        country: address?.country,
        price: list.price,
        propertyType: metadata.propertyType,
        numBathroom: metadata.numBathroom,
        numBedroom: metadata.numBedroom,
        numBed: metadata.numBed,
        amenities: metadata.amenities,
        bedroomDetails: metadata.bedroomDetails,
        thumbnail: list.thumbnail,
        youtubeUrl: metadata.youtubeUrl
      })
    }

  }

  const getBase64ForImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
  });
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64ForImage(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };


  const onFinish = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const address = {
      addressLine: values.addressLine,
      city: values.city,
      state: values.state,
      country: values.country,
    };
    const metadata = {
      amenities: values.amenities,
      propertyType: values.propertyType,
      numBedroom: values.numBedroom,
      numBathroom: values.numBathroom,
      numBed: values.numBed,
      bedroomDetails: values.bedroomDetails,
      youtubeUrl: values.youtubeUrl || ''
    };
    console.log('image:', fileList[0],values.thumbnail)
    const params = {      
      title: values.title,
      address,
      price: Number(values.price),
      thumbnail: fileList.length ? fileList[0].thumbUrl : values.thumbnail,
      metadata: metadata,
    };

    if (values.title){
      const res = await editList(id, params);
      if (res) {
        message.success('Listing edit successfully!');
        navigateToPrev();
      } else {
        message.error('Listing edit failed!');
      }
    }

    
  };

  //set disabled save button
  const [isSaveDisabled, setSaveDisabled] = useState(true);
  const handleFieldChange = (_, allFields) => {
    const allEmpty = allFields.every(field => !field.value);
    setSaveDisabled(allEmpty);
  };

  const propertyTypes = [
    'Room',
    'Share Room',
    'Unit',
    'Apartment',
    'Townhouse',
    'House',
    'Land',
  ];

  const amenities = [
    'Wi-Fi',
    'Wash machine',
    'Air condition',
    'Dryer',
    'TV',
    'Pool',
    'Free parking',
    'Gym',
    'BBQ grill',
    'Beachfront',
    'Waterfront',
  ];

  const validateMessages = {
    required: 'please input ${label}!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
    pattern: {
      mismatch: '${label} must be a valid number!',
    },
  };

  const layout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  

  return(
    <Row gutter={[16, 48]}>
      <Col xs={{ span: 24 }} md={{ span: 16 }} sm={{ span: 22 }} lg={{ span: 12 }} xxl={{ span: 8 }}>
        <div>
          <Form
            className='edit-form'
            name="nest-messages"
            {...layout}
            form={form}
            onFinish={onFinish}
            style={{
              maxWidth: '100%',
            }}
            onFieldsChange={handleFieldChange}
            validateMessages={validateMessages}
            initialValues={{
              thumbnail: listDetail.thumbnail
            }}
          >
            <Form.Item
              name='title'
              label="title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input name='title' placeholder= {listDetail.title} />
            </Form.Item>

            <Form.Item
              name="addressLine"
              label="addressLine"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input name="addressLine" placeholder="E.g. 233 Anzac Parade" />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input name="city" placeholder="E.g. Sydney" />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input name="state" placeholder="E.g. NSW" />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input name="country" placeholder="E.g. Australia" />
            </Form.Item>
            <Form.Item
              name='price'
              label="price"
              rules={[{ type: 'number', min: 0, max: 99999},]}
            >
              <InputNumber placeholder={listDetail.price} style={{ width: '100%'}}/>

            </Form.Item>
            <Form.Item
              name="propertyType"
              label="Property Type"
            >
              <Select
                placeholder={editMetadata.propertyType}
                optionLabelProp="label"
              >
                {propertyTypes.map((item, idx) => (
                  <Select.Option key={idx} value={item} label={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="numBathroom"
              label="Number of Bathroom"
              rules={[
                { pattern: /^\d+$/},
              ]}
            >
              <Input placeholder= {editMetadata.numBathroom}/>
            </Form.Item>

            <Form.Item
              name="numBedroom"
              label="Number of Bedroom"
              rules={[
                {
                  pattern: /^\d+$/,
                },
              ]}
            >
              <Input placeholder={editMetadata.numBedroom} />
            </Form.Item>

            <Form.Item
              name="numBed"
              label="Number of Bed"
              rules={[
                {
                  pattern: /^\d+$/,
                },
              ]}
            >
              <Input placeholder={editMetadata.numBed}/>
            </Form.Item>


            <Form.Item name="amenities" label="Amenities">
              <Select
                placeholder={editMetadata.amenities? editMetadata.amenities.map((item) => item + ' | ') : 'new amenities'}
                optionLabelProp="label"
                mode="multiple"
              >
                {amenities.map((item, idx) => (
                  <Select.Option key={idx} value={item} label={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="bedroomDetails"
              label="Bedroom details"
              >
              <TextArea placeholder="For example, how many beds in each bedroom and their sizes" rows={3}/>
            </Form.Item>
            <Form.Item name="thumbnail" label="Thumbnail"
              rules={[{
                required: true,
                message: 'Please upload image'
              }]}
            >
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
              {
                fileList && fileList.length?
                <></>:
                <Image
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover', marginRight: 12, display: 'inline-block', width: 100}}
                  src={listDetail.thumbnail}
                />
              }
                <Upload 
                  action="http://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  maxCount={1}
                >
                  {fileList.length > 1 ? null : uploadButton}
                </Upload>
              </div>
            </Form.Item>
            <Form.Item name="youtubeUrl" label="Youtube url">
              <Input placeholder="Please input a Youtube URL"/>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
              }}
            >
              <Button type="primary" htmlType="submit" 
                onClick={onFinish}
                disabled={isSaveDisabled}
              >
                Save
              </Button>
              <Button 
                htmlType="button"
                style={{
                  margin: '0 8px',
                }}
                onClick={navigateToPrev}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={()=>setPreviewOpen(false)}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </div>
      </Col>
    </Row>
  )
}

export default App;