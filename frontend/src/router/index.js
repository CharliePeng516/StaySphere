import { useRoutes, Navigate } from 'react-router-dom'
import Login from '../layouts/header/LoginPage'
import Signup from '../layouts/header/SignupPage'
/* Router Modules */
import listRouter from './modules/list'
import myListRouter from './modules/mylist'

const rootRouter = [
  {
    path: '/',
    element: <Navigate to="/list/index" />
  },
  {
    path:'/login',
    element: <Login/>
  },
  {
    path:'/signup',
    element: <Signup/>
  },
  ...listRouter,
  ...myListRouter
]

// 路由列表对象
const Router = () => {
  const routes = useRoutes(rootRouter)
  return routes
}

export default Router