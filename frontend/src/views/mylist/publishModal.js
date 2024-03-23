import React, { useState } from 'react';
import { Modal, message, Form, DatePicker, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { publishList } from '@/api/listings';
import { newBook } from '@/api/bookings'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './style.scss';

const PublishModal = (props) => {
  const { RangePicker } = DatePicker;
  const {setrefresh, isModalOpen, setIsModalOpen, listingId} = props;


  // eslint-disable-next-line no-unused-vars
  const [bookId, setBookId] = useState(null)

  const navigate = useNavigate()

  const { type, totalPrice = 0 } = props
  console.log('type', type)

  const onFinish = async (value) => {
    const publishCallback = async (value) => {
      setIsModalOpen(false);
      if(type ==='book'){
        const dateRange = {
          start : value.firstRange[0], end : value.firstRange[1] 
        }
        const res = await newBook({
          id: listingId,
          dateRange,
          totalPrice
        });
        if(res !== undefined){
          message.success('Book successfully!');
        }else{
          setBookId(res.bookingId)
          // TODO
          navigate('/list/index')
        }
        

      }else{
        // Put all range into an array
        const availableRanges = [];
        const firstRange = { start : value.firstRange[0], end : value.firstRange[1] };
        availableRanges.push(firstRange);
        if (value.fields) {
          value.fields.forEach((date) => {
            const dateRange = { start : date.range[0], end : date.range[1] };
            availableRanges.push(dateRange);
          });
        }
        // Publish the listing
        const availability = { availability : availableRanges}
        const res = await publishList(listingId, availability);
        if(res !== undefined){
          message.success('Listing published successfully!');
        }
        setrefresh(true);
      }
      
    };
    publishCallback(value);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Publish Listing"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          onFinish={onFinish}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Form.Item
            name="firstRange"
            rules={[{ required: true, message: 'Please enter a date range' }]}
          >
            <RangePicker
              disabledDate={(currentDate) =>
                currentDate <= moment().subtract(1, 'd')
              }
            />
          </Form.Item>

          <Form.List name="fields">
            {(fields, { add, remove }) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {fields.map((field, index) => (
                    <div key={field.key} className='field_container'>
                      <Form.Item
                        name={[index, 'range']}
                        rules={[
                          { required: true, message: 'Please enter a date range' },
                        ]}
                      >
                        <RangePicker 
                          disabledDate={(currentDate) =>
                            currentDate <= moment().subtract(1, 'd')
                          }
                        />
                      </Form.Item>
                      {fields.length >= 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </div>
                  ))}
                  {
                    type && type === 'book'?
                    null:
                    <Form.Item>
                      <Button type="dashed" aria-expanded={true} onClick={() => add()}>
                        <PlusOutlined /> Add field
                      </Button>
                    </Form.Item>
                  }
                  
                </div>
              );
            }}
          </Form.List>

          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button name="publishSubmit" type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PublishModal;