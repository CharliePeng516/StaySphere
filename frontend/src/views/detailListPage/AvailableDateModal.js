import React from 'react';
import { Form,  Modal, DatePicker } from 'antd';
// import moment from 'moment'
const { RangePicker } = DatePicker;

const AvailableDateForm = ({ open, onCreate, onCancel, availableData }) => {
  const [form] = Form.useForm();
  console.log('availableData', availableData)

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 5,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 19,
      },
    },
  };
  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select date!',
      },
    ],
  };

  // eslint-disable-next-line arrow-body-style
  // TODO disabled book date range
  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   // const flag = current && availableData.every(item=>{
  //   //   console.log('---',current >= moment(item.start).endOf('day') && current <moment(item.end).endOf('day'))
  //   //   return current >= moment(item.start).endOf('day') && current <moment(item.end).endOf('day')
  //   // })
  //   return false
  // };

  return (
    <Modal
      open={open}
      title="Add a review"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
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
        name="submit-review"
      >
        <Form.Item
          name="aDateRange"
          label="Select Date"
          rules={[
            {
              required: true,
              message: 'Please select booking date!',
            },
          ]}
        >
          <RangePicker {...rangeConfig}/>
        </Form.Item>

      </Form>
    </Modal>
  );
};
export default AvailableDateForm