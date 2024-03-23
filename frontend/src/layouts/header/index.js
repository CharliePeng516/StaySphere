import React, { useEffect, useState} from 'react';
import {Layout, Menu, Input, Dropdown, message, Avatar, Modal, Space, Tabs, Button, InputNumber, Select, Row, Col } from 'antd';
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setUserInfo } from "@/store/modules/user";

import { setSearchParams } from "@/store/modules/search";
import { SearchOutlined, ExclamationCircleOutlined, LoginOutlined, LogoutOutlined, ContainerTwoTone, FilterTwoTone, HomeTwoTone } from '@ant-design/icons'
import { getData } from '@/api/data'
import { logout } from '@/api/user'
// import { listings } from '@/api/listings'
import logo from "@/assets/images/logo2.png"
import './index.scss'


const { Header } = Layout;
// const { RangePicker } = DatePicker;
// const { Search } = Input;
// const { Search } = Input;
const App = () => {

  const [menuList, setMenuList] = useState([])

  const [width, setWidth] = useState(window.innerWidth);

  const [filterType, setFilterType] = useState('numBed')

  // const [priceRange, setPrice] = setPrice([0,0])
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  // const loginRef = useRef(null);

  // const signupRef = useRef(null)

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { pathname } = useLocation()

  // 通过useSelector直接拿到store中定义的value
  // const { userInfo } = useSelector((store) => store.user);

  // 当前路由的pathname
  const [selectedKeys, setSelectedKeys] = useState([pathname])

  // navbar click 页面跳转
  const handleClickMenu = ({ key }) => {
    const route = searchRoute(key, menuList)
    console.log('route: ', route)
    navigate(key)
  }

  // 获取菜单数据
  const getMenuData = async () => {
    const { data } = await getData()
    // console.log('data: ', data)
    setMenuList(menuDeepLoop(data))
  }
  // pathname 改变时,重新设置当前菜单选中项
  useEffect(() => {
    setSelectedKeys([pathname])
  }, [pathname])
  useEffect(() => {
    getMenuData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * 递归处理后台返回菜单
   * @param {*} menuList
   * @returns menuFormat
   */
  const menuDeepLoop = (menuList = []) => {
    return menuList.map((item) => {
      // TODO auth requiresAuth
      // console.log('menu item:', item)
      let menuFormat = localStorage.getItem('token') ? { label: item.title, key: item.path } : item.requiresAuth ? null : { label: item.title, key: item.path }
      if (item.children) {
        menuFormat.children = menuDeepLoop(item.children)
      }
      return menuFormat
    })
  }

  // 根据path查找指定对象
  const searchRoute = (path, routes) => {
    let route = {}
    for (let item of routes) {
      if (item.key === path) return item
      if (item.children) {
        const res = searchRoute(path, item.children)
        if (res && Object.keys(res).length) {
          route = res
        }
      }
    }
    return route
  }

  const onLogout = () => {
		Modal.confirm({
			title: "Logout Confirm",
			icon: <ExclamationCircleOutlined />,
			content: "Are you sure you want to log out？",
			okText: "OK",
			cancelText: "Cancel",
			onOk: () => {
        logout()
         .then(res=>{
            if(res){
              message.success("Logout Success！");
              const data = { name: '', token: '', email: '' }
              dispatch(setUserInfo({ userInfo: {...data}}))
              localStorage.removeItem('token')
              localStorage.removeItem('email')
              navigate("/")
            }
         })
			}
		});
	};

  // Dropdown Menu
  // const items = [
  //   !localStorage.getItem('token')?{
  //     key: "1",
  //     label: <div><UserOutlined /><span className='ml-1'>Sign up</span></div>,
  //     onClick: () => signupRef.current.showModal()
  //   }:null,
  //   !localStorage.getItem('token')?{
  //     key: "2",
  //     label: <div><LoginOutlined /><span className='ml-1'>Login</span></div>,
  //     onClick: () => loginRef.current.showModal()
  //   }:null,
  //   localStorage.getItem('token')?{
  //     key: "3",
  //     label: <div><LogoutOutlined/><span className='ml-1'>Logout</span></div>,
  //     onClick: onLogout
  //   }:null,
  //   // {
  //   //   type: "divider"
  //   // },
  //   localStorage.getItem('token')?{
  //     key: "4",
  //     label: <div><HomeOutlined /><span className='ml-1'>Airbrb your home</span></div>,
  //     onClick: () => navigate("/myairbrb")
  //   }:null
  // ];

  //search menu
  const contentStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
    padding: '12px 20px 20px'
  };

  // const [addrOptions, setAddrOptions] = useState([]);
  // const handleSearch = (value) => {
  //   console.log('search...')
  //   setAddrOptions(
  //     !value
  //       ? []
  //       : [
  //           {
  //             value,
  //           }
  //         ],
  //   );
  //   // fetchListing()
  // };
  const handleSearchAddress = (data) => {
    dispatch(setSearchParams({ address: data }))
  };

  const handleSearchList=(v)=>{
    dispatch(setSearchParams({ title: v }))
  }

  // const onChangeMinPrice=v=>{
  //   const maxPrice = priceRange[1]
  //   setPrice([])
  //   dispatch(setSearchParams({ title: v }))
  // }

  

  // const onFinish = (values)=>{
  //   console.log('Received values of form: ', values);
  // }

  const onChangeFilter = (value)=>{
    setFilterType(value)
  }

  const options = [
    {
      key: '1',
      label: <span><HomeTwoTone />Where</span>,
      children:
      //  <AutoComplete
      //     popupClassName="certain-category-search-dropdown"
      //     popupMatchSelectWidth={350}
      //     style={{ maxWidth: 350 }}
      //     onSelect={onSelect}
      //     onSearch={handleSearch}
      //     options={addrOptions}
      //   >
      //   <Input suffix={<SearchOutlined />} placeholder="input here" allowClear/>
      // </AutoComplete>
      <Input.Search placeholder="input here" style={{ width: 350 }} allowClear onSearch={handleSearchAddress}/>
      ,
    },
    {
      key: '2',
      label: <span><ContainerTwoTone />Title</span>,
      children: <Input.Search placeholder="input here" style={{ width: 350 }} allowClear onSearch={handleSearchList}/>,
    },
    {
      key: '3',
      label: <span><FilterTwoTone />Other Features</span>,
      children: 
      // <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{ maxWidth: 350 }} onFinish={onFinish}>
      //   <Form.Item label="Bedrooms" name="bed" >
      //     <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100%' }}/>
      //   </Form.Item>
      //   <Form.Item label="Date" name="date">
      //     <RangePicker />
      //   </Form.Item>
      //   <Form.Item label="Price" style={{ marginBottom: 0 }}>
      //     <Form.Item
      //       name="min-price"
      //       rules={[{ required: true }]}
      //       style={{ display: 'inline-block', width: 'calc(50% - 6px)' }}
      //     >
      //       <InputNumber placeholder="min" />
      //     </Form.Item>
      //     <Form.Item
      //       name="max-price"
      //       rules={[{ required: true }]}
      //       style={{ display: 'inline-block', width: 'calc(50% - 6px)'}}
      //     >
      //       <InputNumber placeholder="max" />
      //     </Form.Item>
      //   </Form.Item>
      //   <Form.Item label="Reviews" name="reviews">
      //     <Select>
      //       <Select.Option value="From High To Low">From High To Low</Select.Option>
      //       <Select.Option value="From Low To High">From Low To High</Select.Option>
      //     </Select>
      //   </Form.Item>
      //   <Form.Item
      //     wrapperCol={{
      //       span: 12,
      //       offset: 6,
      //     }}
      //   >
      //     <Space>
      //       <Button type="primary" htmlType="submit">
      //         Search
      //       </Button>
      //       <Button htmlType="reset">Reset</Button>
      //     </Space>
      //   </Form.Item>
      // </Form>
    <div>
      <Select
        defaultValue="numBed"
        style={{ width: '350px' }}
        onChange={onChangeFilter}
        options={[
          {
            value: 'numBed',
            label: 'Number of Beds',
          },
          {
            value: 'numBedroom',
            label: 'Number of Bedrooms',
          },
          // {
          //   value: 'Date',
          //   label: 'Date',
          // },
          {
            value: 'price',
            label: 'Price',
          },
        ]}
      />
      
      {
        filterType === 'numBedroom' ?
        <div style={{ marginTop: 20 }}>Num of bedroom: <InputNumber style={{ width: '100%'}} min={1} onPressEnter={(e)=>{dispatch(setSearchParams({numBedroom: e.target.value}))}}></InputNumber></div>:null
      }
      {
        filterType === 'numBed' ?
        <div style={{ marginTop: 20 }}>Num of bed: <InputNumber style={{ width: '100%'}} min={1} onPressEnter={(e)=>{dispatch(setSearchParams({ numBed: e.target.value }))}}></InputNumber></div>:null
      }
      {/* {
        filterType === 'price' ?
        <div style={{ marginTop: 20 }}>
          Min: <InputNumber style={{ width: '100%'}} min={1} onChange={onChangeMinPrice}></InputNumber>
          Max: <InputNumber style={{ width: '100%'}} min={1} onChange={onChangeMaxPrice}></InputNumber>
        </div>:null
      } */}
    </div>
      ,
    },
  ]

  

  return (
    <Header
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid #d9d9d9'
      }}
    >
      <div className="nav-logo__container">
        <img src={logo} alt="logo" className="img"/>
        <span className="title">Airbrb</span>
      </div>
      <Menu style={{
        flex: 1
      }} 
        className="nav-name__container" 
        mode="horizontal" 
        selectedKeys={selectedKeys}
        items={menuList} 
        onClick={handleClickMenu}
      />
      <div className='search-bar__container'>
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={contentStyle}>
              <Space>
                Filter By...
              </Space>
              <Tabs defaultActiveKey="1" items={options} />
            </div>
          )}
        >
          {/* <Space>
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{
                width: 280,
              }}
            />
          </Space> */}
          <Row>
            <Col xs={{ span: 0 }} md={{ span: 24 }} sm={{ span: 0 }} lg={{ span: 24}}>
              <Space.Compact>
                <Input
                  placeholder="Search"
                  addonBefore="Any Where"
                  suffix={<SearchOutlined />}
                  allowClear
                />
              {/* <Search style={{ width: 280 }} addonBefore="Any Where" placeholder="Search" allowClear /> */}
            </Space.Compact>
            </Col>
          </Row>
        </Dropdown>    
      </div>
      <div className='user__container'>
        <Row>
        {
          localStorage.getItem('token') && width >990?
          <Col xs={0} sm={0} md={6} lg={5} xxl={5}>
            <Avatar style={{ backgroundColor: '#1777ff' }}>
              {localStorage.getItem('email').charAt(0)}
            </Avatar></Col> :null
        }
        {
          localStorage.getItem('token')? 
          <Col xs={24} sm={24} md={18} lg={19} xxl={19}>
            <Button name="logout-btn" type="link" icon={<LogoutOutlined/>} onClick={onLogout}>{ width >480? 'logout': ''}</Button></Col> :
            <Button name="login-btn" type="link" icon={<LoginOutlined/>} onClick={()=>navigate('/login')}>Login</Button>}
        {/* <Dropdown
          
          menu={{items}}
          placement="bottom" arrow trigger={["click"]}
        >
          <Space>
          {localStorage.getItem('email')?
            <Avatar style={{ backgroundColor: '#1777ff' }}>
              {localStorage.getItem('email').charAt(0)}
            </Avatar>
            :
            <Avatar size="large" src={avatar} />
          }
            {localStorage.getItem('email') || 'Not Logged'}
            <DownOutlined />
          </Space>
        </Dropdown> */}
      {/* <LoginModal innerRef={loginRef}></LoginModal>
      <SignupModal innerRef={signupRef}></SignupModal> */}
      </Row>
      </div> 
    </Header>
  );
};
export default App;