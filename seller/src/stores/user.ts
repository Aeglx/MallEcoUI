import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const useUserStore = defineStore('user', () => {
  const logout = () => {
    Cookies.remove('userInfoSeller')
    localStorage.clear()
  }

  return {
    logout
  }
})

export default useUserStore
export { useUserStore }

