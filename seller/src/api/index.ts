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
  sellerUrl
} from '@/libs/axios'

declare const BASE: any

const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

// 文件上传接口
export const uploadFile = commonUrl + '/common/common/upload/file'
// Websocket
export const ws = sellerUrl + '/ws'

// 获取所有city
export const getAllCity = (params?: any) => {
  return getRequest(commonUrl + '/common/common/region/allCity', params)
}

// 获取首页查询数据
export const homeStatistics = (params?: any) => {
  return getRequest('/statistics/index', params)
}

// 登录
export const login = (params: any) => {
  return postRequestWithNoTokenData('/passport/store/login', params)
}

// 验证码登录（手机号+验证码）
export const smsLogin = (params: any) => {
  return postRequestWithNoTokenData('/passport/store/smsLogin', params)
}

// 发送短信验证码
export const sendSms = (params: any) => {
  const { verificationEnums, mobile } = params
  return getRequestWithNoToken(
    commonUrl + `/common/common/sms/${verificationEnums}/${mobile}`,
    params
  )
}

// 登出
export const logout = () => {
  return postRequest('/passport/store/logout')
}

// 刷新token
export const handleRefreshToken = (token: string) => {
  return getRequestWithNoToken(`/passport/store/refresh/${token}`)
}

// 获取用户登录信息
export const userInfo = (params?: any) => {
  return getRequest('/passport/store/info', params)
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
  return putRequest('/passport/store/edit', params)
}

// 个人中心修改密码
export const changePass = (params: any) => {
  return putRequest('/passport/store/editPassword', params)
}

