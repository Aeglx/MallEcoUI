import { getRequest, postRequest } from '@/libs/axios'
import { v4 as uuidv4 } from 'uuid'
import { commonUrl } from '@/libs/axios'
import storage from '@/utils/storage'

// 获取UUID（从localStorage或生成新的）
const getUuid = (): string => {
  let uuid = storage.getItem('verification_uuid')
  if (!uuid) {
    uuid = uuidv4()
    storage.setItem('verification_uuid', uuid)
  }
  return uuid
}

// 获取验证码图片
export const getVerifyImg = (type: string) => {
  const uuid = getUuid()
  return getRequest(
    `${commonUrl}/common/common/slider/${type}`,
    {},
    {
      needToken: false,
      headers: {
        uuid: uuid
      }
    }
  )
}

// 提交验证码
export const postVerifyImg = (params: any) => {
  const uuid = getUuid()
  const verificationEnums = params.verificationEnums || params.type
  return postRequest(
    `${commonUrl}/common/common/slider/${verificationEnums}`,
    {
      xPos: params.x, // 使用xPos参数名，与后端保持一致
      y: params.y
    },
    {
      needToken: false,
      headers: {
        uuid: uuid
      }
    }
  )
}

