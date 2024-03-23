/* main screen (root) */
import React from 'react'
import Layout from '@/layouts'
import lazyLoad from "@/utils/lazyLoad";


const homeRouter = [
  {
    element: <Layout />,
    children: [
      {
        path: '/list/index',
        element: lazyLoad(React.lazy(() => import("@/views/list"))),
        meta: {
          requiresAuth: false,
          title: 'Listing',
          key: 'List'
        }
      },
      {
        path: `/listings/:id`,
        element: lazyLoad(React.lazy(() => import("@/views/detailListPage/index"))),
        meta: {
          requiresAuth: true, 
          title: 'list-page',
          key: 'ListPage'
        },
      }
    ]
  }
]
export default homeRouter