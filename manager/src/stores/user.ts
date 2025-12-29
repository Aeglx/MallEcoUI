import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const useUserStore = defineStore('user', () => {
  const logout = () => {
    Cookies.remove('userInfoManager')
    // 清空打开的页面等数据
    localStorage.clear()
  }

  return {
    logout
  }
})

export default useUserStore
export { useUserStore }

