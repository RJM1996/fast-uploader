import { createAction } from '@/common/axios.js'
import * as API from '@/api/login/login.api.js'

export const loginAPI = (req) => {
  return createAction(req, API.loginAPI, null, 'login')
}
export const logoutAPI = (req) => {
  return createAction(req, API.logoutAPI, null, 'logout')
}
export const getUserInfoAPI = (req) => {
  return Promise.resolve({
    name: 'admin',
    menuList: [
      {
        title: '首页',
        icon: 'AppstoreOutlined',
        path: '/index'
      },
      {
        title: 'Form',
        icon: 'BarChartOutlined',
        path: '/formDemo'
      },
      {
        title: 'Table',
        icon: 'BarChartOutlined',
        path: '/tableDemo'
      },
      {
        title: 'TableForm',
        icon: 'BarChartOutlined',
        path: '/tableFormDemo'
      },
      {
        title: 'Search',
        icon: 'BarChartOutlined',
        path: '/searchDemo'
      },
      {
        title: 'SearchTableDemo',
        icon: 'BarChartOutlined',
        path: '/searchTableDemo'
      },
      {
        title: 'UploadAndDownload',
        icon: 'CloudOutlined',
        path: '/uploadAndDownload'
      },
      // {
      //   title: '权限管理',
      //   key: 'permissionManage',
      //   icon: 'CloudOutlined',
      //   children: [
      //     {
      //       title: '用户管理',
      //       path: '/userManage'
      //     },
      //     {
      //       title: '角色管理',
      //       path: '/roleManage'
      //     }
      //   ]
      // }
    ]
  })
}
