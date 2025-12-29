import { getRequest, getRequestWithNoToken } from '@/libs/axios'

declare const BASE: any

const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

// 获取基础站点信息
export const getBaseSite = (params?: any) => {
  return getRequestWithNoToken(commonUrl + '/common/common/site', params)
}

