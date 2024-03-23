import { Outlet } from 'react-router-dom'
import { Layout as AntLayout } from 'antd'
import Header from './header'
import './index.scss'
export default function Layout() {
  const { Content } = AntLayout
  return (
    // 这里不用 Layout 组件原因是切换页面时样式会先错乱然后在正常显示，造成页面闪屏效果
    <div className="container">
      <AntLayout>
        <Header/>
        <Content className='page__container'>
          <Outlet />
        </Content>
        {/* <Footer style={{ backgroundColor: '#fff' }}>Footer</Footer> */}
      </AntLayout>
    </div>
  )
}