// 菜单数据
export const menuData = {
  code: 200,
  data: [
    {
      icon: 'HomeOutlined',
      title: 'Listing',
      path: '/list/index',
      requiresAuth: false
    },
    {
      icon: 'FileSearchOutlined',
      title: 'MyAirbrb',
      path: '/myairbrb',
      requiresAuth: true
    },
    // {
    //   icon: 'TableOutlined',
    //   title: '超级表格',
    //   path: '/proTable',
    //   children: [
    //     {
    //       icon: 'AppstoreOutlined',
    //       path: '/proTable/useHooks',
    //       title: '使用 Hooks'
    //     }
    //   ]
    // }
  ],
  msg: 'success'
}

export function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuData)
    }, 1000)
  })
}