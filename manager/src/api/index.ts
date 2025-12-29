// 统一请求路径前缀在libs/axios.ts中修改
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  importRequest,
  getRequestWithNoToken,
  putRequestWithNoForm,
  postRequestWithNoTokenData,
  postRequestWithNoForm,
  managerUrl
} from '@/libs/axios'

declare const BASE: any

const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

// 文件上传接口
export const uploadFile = commonUrl + '/common/common/upload/file'
// Websocket
export const ws = managerUrl + '/ws'

// 获取所有city
export const getAllCity = (params?: any) => {
  return getRequest(commonUrl + '/common/common/region/allCity', params)
}

// 获取首页查询数据
export const homeStatistics = (params?: any) => {
  return getRequest('/statistics/index', params)
}

// 获取首页top10商品
export const hotGoods = (params?: any) => {
  return getRequest('/statistics/index/goodsStatistics', params)
}

// 获取首页top10店铺
export const hotShops = (params?: any) => {
  return getRequest('/statistics/index/storeStatistics', params)
}

// 通知提示信息
export const getNoticePage = (params?: any) => {
  return getRequest('/statistics/index/notice', params)
}

// 登录
export const login = (params: any) => {
  return postRequestWithNoTokenData('/passport/user/login', params)
}

// 验证码登录（手机号+验证码）
export const smsLogin = (params: any) => {
  return postRequestWithNoTokenData('/buyer/passport/member/smsLogin', params)
}

// 发送短信验证码
export const sendSms = (params: any) => {
  const { verificationEnums, mobile } = params
  return getRequestWithNoToken(
    commonUrl + `/common/common/sms/${verificationEnums}/${mobile}`,
    params
  )
}

// 获取buyer URL（用于调用buyer接口）
// buyer接口不需要加PREFIX，因为buyerUrl已经是完整的API基础路径
const buyerUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.buyer : BASE.API_PROD.buyer

// 创建buyer接口专用的axios实例
import axios from 'axios'
const buyerService = axios.create({
  baseURL: buyerUrl, // buyer接口直接使用buyerUrl，不加PREFIX
  timeout: 8000
})

// 获取PC扫码登录session（调用buyer接口）
export const getSCLoginCode = (params?: any) => {
  return buyerService({
    method: 'post',
    url: '/buyer/passport/member/pc_session',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      function (data: any) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.length - 1)
        return ret
      }
    ]
  }).then((res: any) => {
    // 统一返回格式
    return res.data
  })
}

// PC扫码登录状态查询（调用buyer接口）
export const sCLogin = (token: string, params?: any) => {
  return buyerService({
    method: 'post',
    url: `/buyer/passport/member/session_login/${token}`,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      function (data: any) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.length - 1)
        return ret
      }
    ]
  }).then((res: any) => {
    // 统一返回格式
    return res.data
  })
}

// 登出
export const logout = () => {
  return postRequest('/passport/user/logout')
}

// 刷新token
export const handleRefreshToken = (token: string) => {
  return getRequestWithNoToken(`/passport/user/refresh/${token}`)
}

// 获取用户登录信息
export const userInfo = (params?: any) => {
  return getRequest('/passport/user/info', params)
}

// 获取当前用户权限菜单
export const getCurrentPermissionList = (params?: any) => {
  return getRequest('/permission/menu/memberMenu', params)
}

// 获取全部权限数据
export const getAllPermissionList = (params?: any) => {
  return getRequest('/permission/menu/tree', params)
}

// 添加权限
export const addPermission = (params: any) => {
  return postRequest('/permission/menu', params)
}

// 编辑权限
export const editPermission = (params: any) => {
  return putRequest(`/permission/menu/${params.id}`, params)
}

// 删除权限
export const deletePermission = (ids: string, params?: any) => {
  return deleteRequest(`/permission/menu/${ids}`, params)
}

// 搜索权限
export const searchPermission = (params?: any) => {
  return getRequest('/permission/menu', params)
}

// 个人中心编辑
export const userInfoEdit = (params: any) => {
  return putRequest('/passport/user/edit', params)
}

// 个人中心修改密码
export const changePass = (params: any) => {
  return putRequest('/passport/user/editPassword', params)
}

