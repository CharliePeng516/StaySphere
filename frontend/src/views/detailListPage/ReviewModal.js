import React from 'react';
import { Rate, Form,  Modal, Input } from 'antd';
const { TextArea } = Input
const AddReviewForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
    },
  };
  return (
    <Modal
      open={open}
      title="Add a review"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields(valid=>{
            console.log('valid', valid )
          })
          .then((values) => {
            console.log('valuesvaluesvaluesvalues', values )
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        {...formItemLayout}
        style={{ marginTop: 22 }}
        form={form}
      >
        <Form.Item
          name="rate"
          label="Rate"
          rules={[
            {
              required: true,
              message: 'Please click rate star!',
            },
          ]}
        >
          <Rate/>
        </Form.Item>
        <Form.Item name="comment" label="Comment">
          <TextArea name="comment" row={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddReviewForm