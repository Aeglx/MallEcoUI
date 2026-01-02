import { postRequest, getRequest } from '@/libs/axios'

/**
 * 注册
 */
export function regist(params: any) {
  return postRequest('/buyer/passport/member/register', params, {
    needToken: false
  })
}

/**
 * 账号密码登录
 */
export function login(params: any) {
  return postRequest('/buyer/passport/member/userLogin', params, {
    needToken: false,
    headers: { clientType: 'PC' }
  })
}

/**
 * 手机号验证码登录
 */
export function smsLogin(params: any) {
  return postRequest('/buyer/passport/member/smsLogin', params, {
    needToken: false,
    headers: { clientType: 'PC' }
  })
}

/**
 * 获取用户信息
 */
export function getMemberMsg() {
  return getRequest('/buyer/passport/member')
}

/**
 * 退出登录
 */
export function logout() {
  return postRequest('/buyer/passport/member/logout')
}

/**
 * 第三方登录回调
 */
export function loginCallback(uuid: string) {
  return getRequest(`/buyer/passport/connect/connect/result?state=${uuid}`, {}, {
    needToken: false
  })
}

/**
 * 忘记密码 - 验证手机验证码
 */
export function validateCode(params: any) {
  return postRequest('/buyer/passport/member/resetByMobile', params, {
    needToken: false
  })
}

/**
 * 忘记密码 - 重置密码
 */
export function resetPassword(params: any) {
  return postRequest('/buyer/passport/member/resetPassword', params, {
    needToken: false
  })
}

/**
 * 获取PC登录二维码
 */
export function getSCLoginCode(params: any = {}) {
  return postRequest('/buyer/passport/member/pc_session', params, {
    needToken: false
  })
}

/**
 * 扫码登录
 */
export function sCLogin(token: string, params: any) {
  return postRequest(`/buyer/passport/member/session_login/${token}`, params, {
    needToken: false
  })
}

