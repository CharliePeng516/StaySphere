import Layout from '@/layouts'
import React from 'react'
import lazyLoad from "@/utils/lazyLoad";
// import CreateMylist from '@/views/mylist/create'
const MylistRoute = [
  {
    element: <Layout />,
    children: [
      {
        path: '/myairbrb',
        element: lazyLoad(React.lazy(() => import("@/views/mylist"))),
        // element: <Mylist/>,
        meta: {
          requiresAuth: true, 
          title: 'MyAirbrb',
          key: 'myairbrb'
        },
      },
      {
        path: '/create-myairbrb',
        element: lazyLoad(React.lazy(() => import("@/views/mylist/create"))),
        meta: {
          requiresAuth: true, 
          title: 'MyAirbrb',
          key: 'create-myairbrb'
        },
      },

      {
        path: '/edit-myairbrb/:id',
        element: lazyLoad(React.lazy(() => import("@/views/mylist/edit"))),
        meta: {
          requiresAuth: true, 
          title: 'MyAirbrb',
          key: 'edit-myairbrb'
        },
      },
      {
        path: '/myairbrb/bookings/:id',
        element: lazyLoad(React.lazy(() => import("@/views/mylist/myBooking"))),
        meta: {
          requiresAuth: true, 
          title: 'MyBooking',
          key: 'mybooking'
        },
      },
    ]
  },

]

export default MylistRoute