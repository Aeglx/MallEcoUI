import { defineStore } from 'pinia'
import { ref } from 'vue'
import config from '@/config'

const localSetting = window.localStorage.getItem('admin-setting')
const defaultSetting = localSetting ? JSON.parse(localSetting) : config.setting

const useSettingStore = defineStore('setting', () => {
  const setting = ref(defaultSetting)

  const updateSetting = (data: any) => {
    setting.value = data
    window.localStorage.setItem('admin-setting', JSON.stringify(data))
  }

  return {
    setting,
    updateSetting
  }
})

export default useSettingStore
export { useSettingStore }

