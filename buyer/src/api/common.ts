import { getRequest } from '@/libs/axios'

/**
 * 获取基础站点信息
 */
export function getBaseSite() {
  return getRequest('/common/common/site')
}

