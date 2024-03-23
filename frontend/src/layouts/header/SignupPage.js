import { message, Form, Input, Row, Col, Flex, Button } from "antd";
import { LockOutlined,MailOutlined, UserOutlined } from '@ant-design/icons';

import { registerUser } from '@/api/user'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setUserInfo} from "@/store/modules/user";
import './index.scss'

const SignupModal = () => {
  const [form] = Form.useForm();
  // 通过useDispatch 派发事件
  const dispatch = useDispatch();
	// navigate
  const navigate = useNavigate();

	const handleOk = () => {
    // form.resetFields();
    form
      .validateFields()
      .then((values) => {
        const {confirmPassword, ...others} = values
        registerUser(others)
          .then(res=>{
            console.log('registerUser:', res)
            const data = {
              name:  values.name, token: res.token, email: values.email
            }
            dispatch(setUserInfo({userInfo: {...data}}))
            form.resetFields();
						navigate('/')
						message.success("Congratulations! Sign Up Success 🎉🎉🎉");
          })
      })
      .catch((info) => {
        message.error(info);
      });
	};


	// const onFinish = (values) => {
	// 	console.log('Success:', values);
	// };
	// const onFinishFailed = (errorInfo) => {
	// 	console.log('Failed:', errorInfo);
	// };

	return (
		<Row>
			<Col span={24}>
			<Flex gap="small" align="center" justify="center" vertical style={{width: '100%', height: '100vh'}}>
				<div className="login-form">
					<div className="login-form__title">Welcome! Please Sign up 🎉🎉🎉</div>
					<Form
						form={form}
						className="login-form__container"
						name="basic"
						autoComplete="off"
						onFinish={handleOk}
					>
						<Form.Item
							name="name"
							rules={[
								{
									required: true,
									message: 'Please input name!',
								},
							]}
						>
							<Input name="name" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Please input name"/>
						</Form.Item>
						<Form.Item
							name="email"
							rules={[
								{
									required: true,
									message: 'Please input email!',
								},
								{
									type: 'email',
									message: 'The input is not valid email'
								}
							]}
						>
							<Input name="email" prefix={<MailOutlined className="site-form-item-icon" />}  placeholder="Email"/>
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Please input your password!',
								},
							]}
						>
							<Input.Password name="password" prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
						</Form.Item>
						<Form.Item
							name="confirmPassword"
							rules={[
								{
									required: true,
									message: 'Please confirm your password!',
								},
							]}
						>
							<Input.Password name="confirmPassword" prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirm password"/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" className="login-form-button">
								Sign up
							</Button>
							<Button className="login-form-button" style={{ marginTop: 12}} onClick={()=> navigate('/login')}>
								Cancel
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Flex>
		</Col>
		</Row>
	);
};
export default SignupModal;