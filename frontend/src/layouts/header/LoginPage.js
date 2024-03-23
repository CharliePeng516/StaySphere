import { message, Form, Input, Row, Col, Flex, Button } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from '@/api/user'
import {setUserInfo} from "@/store/modules/user";

import './index.scss'

const LoginModal = () => {
	const [form] = Form.useForm();
  const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleOk = () => {
		form
      .validateFields()
      .then((values) => {
        loginUser(values)
          .then(res=>{
						if(res){
							const data = { token: res.token, email: values.email }
							dispatch(setUserInfo({userInfo: {...data} }))
							form.resetFields();
							navigate("/list/index")
							message.success("Congratulations! Login Success 🎉🎉🎉");
						}
          })
      })
      .catch((info) => {
        message.error(info);
      });
	};

	return (
		<Row>
			<Col span={24}>
				<Flex gap="small" align="center" justify="center" vertical style={{width: '100%', height: '100vh'}}>
					<div className="login-form">
						<div className="login-form__title">Welcome! Please Login 🎉🎉🎉</div>
						<Form
							form={form}
							className="login-form__container"
							name="basic"
							
							onFinish={handleOk}
							// onFinishFailed={onFinishFailed}
							autoComplete="off"
							>
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
								<Input name="email" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email"/>
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
							<Form.Item>
								<Button type="primary" htmlType="submit" className="login-form-button">
									Log in
								</Button>
								<div style={{ marginTop: 6}}>Or <a name="sign-up-href" href="./signup">Sign up now!</a></div>
							</Form.Item>
						</Form>
					</div>
				</Flex>
			</Col>
		</Row>
	);
};
export default LoginModal;