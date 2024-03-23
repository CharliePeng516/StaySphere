/* eslint-disable no-template-curly-in-string */
import React, { useState } from 'react';
import { Button, Form, Input,Select, message, InputNumber, Upload, Modal, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate} from "react-router-dom";
import { createList } from "@/api/listings";
import './style.scss';

const { TextArea } = Input;
const App = ()=>{
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const navigateToPrev = ()=>{
    navigate("/myairbrb")
  }

  const layout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 16,
    },
  };
  
  const onFinish = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('values', values)
    //construct metadata including amenities, propertyType, and bedroom info
    const address = {
      addressLine: values.addressLine,
      city: values.city,
      state: values.state,
      country: values.country,
    };

    const metadata = {
      amenities: values.amenities,
      propertyType: values.propertyType,
      numBedroom: Number(values.numBedroom),
      numBathroom: Number(values.numBathroom),
      numBed: Number(values.numBed),
      bedroomDetails: values.bedroomDetails,
      youtubeUrl: values.youtubeUrl || ''
    };

    if (values.title){
      const res = await createList({
        title: values.title,
        address: address,
        price: Number(values.price),
        // thumbnail: values.youtubeUrl,
        thumbnail: values.thumbnail.file.thumbUrl,
        metadata: metadata,
      });
      if (res) {
        message.success('Listing created successfully!');
        navigateToPrev();
      } else {
        message.error('Listing created failed!');
      }
    }
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
    // eslint-disable-next-line no-template-curly-in-string
    required: 'please input ${label}!',
    types: {
      // eslint-disable-next-line no-template-curly-in-string
      number: '${label} is not a valid number!',
    },
    number: {
      // eslint-disable-next-line no-template-curly-in-string
      range: '${label} must be between ${min} and ${max}',
    },
    pattern: {
      mismatch: '${label} must be a valid number!',
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
  // const normFile = () => {
  //   console.log('valid')
  //   if( thumbnailType === 'image'){
  //     if(Array.isArray(fileList)){
  //       return !!fileList.length;
  //     }
  //     return false
  //   }else{
  //     return !!youtubeUrl
  //   }
    
  // };

  const fileChange = (fileList)=>{
    if(fileList.file && fileList.file.status === 'done'){
      message.success('Congratulations! Upload Successfully')
      navigate('/list/index')
    }
  }
  return(
    <Row gutter={[16, 48]}>
      <Col xs={{ span: 24 }} md={{ span: 16 }} sm={{ span: 22 }} lg={{ span: 12 }} xxl={{ span: 8 }}>
        <div>
          <Form
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={onFinish}
            style={{
              width: '100%',
            }}
            validateMessages={validateMessages}
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
              <Input name='title' placeholder="E.g. A Nice House" />
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
              rules={[{required: true, type: 'number', min: 0, max: 99999},]}
            >
              <InputNumber name='price' placeholder='E.g. 300' style={{ width: '100%'}}/>

            </Form.Item>            
            <Form.Item
              name="propertyType"
              label="Property Type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Please select a property type"
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
                { required: true},
                { pattern: /^\d+$/},
              ]}
            >
              <Input name="numBathroom" placeholder="E.g. 5" />
            </Form.Item>

            <Form.Item
              name="numBedroom"
              label="Number of Bedroom"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^\d+$/,
                },
              ]}
            >
              <Input name="numBedroom" placeholder="E.g. 5" />
            </Form.Item>

            <Form.Item
              name="numBed"
              label="Number of Bed"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^\d+$/,
                },
              ]}
            >
              <Input name="numBed" placeholder="E.g. 5" />
            </Form.Item>


            <Form.Item name="amenities" label="Amenities">
              <Select
                placeholder="Please select amenity type"
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
              <TextArea name="bedroomDetails" placeholder="For example, how many beds in each bedroom and their sizes" rows={3}/>
            </Form.Item>
            <Form.Item name="thumbnail" label="Thumbnail"
              rules={[{
                required: true,
                message: 'Please upload image'
              }]}
            >
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
              <Button type="primary" htmlType="submit" >
                Submit
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
      <Col xs={{ span: 24 }} md={{ span: 16 }} sm={{ span: 22 }} lg={{ span: 12 }} xxl={{ span: 8 }}>
      <Upload name="file" accept="json" multiple={false} action="http://localhost:5005/upload" listType="picture" onChange={fileChange}>
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
      </Col>
    </Row>
  )
}

export default App;