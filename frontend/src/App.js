// import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'

// Import pages
function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2969e5'
          }
        }}
      >
        <Router />
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
