import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordNormalized } from 'vue-router'

export interface PageTag {
  title: string
  path: string
  name: string
  argu?: any
  query?: any
}

export interface NavItem {
  name: string
  title: string
}

export interface MenuItem {
  id?: string
  name: string
  title: string
  children?: MenuItem[]
  frontRoute?: string
  firstRouterName?: string
}

const useAppStore = defineStore('app', () => {
  const styleStore = ref<string>('')
  const added = ref<boolean>(false)
  const navList = ref<NavItem[]>([])
  const currNav = ref<string>('')
  const currNavTitle = ref<string>('')
  const cachePage = ref<string[]>([])
  const lang = ref<string>('')
  const pageOpenedList = ref<PageTag[]>([
    {
      title: '首页',
      path: '',
      name: 'home_index'
    }
  ])
  const hotWords = ref<any[]>([])
  const menuList = ref<MenuItem[]>([])
  const tagsList = ref<any[]>([])
  const routers = ref<RouteRecordNormalized[]>([])
  const messageCount = ref<number>(0)
  const loading = ref<boolean>(false)
  const dontCache = ref<string[]>(['test', 'test'])
  const notices = ref<any>({})

  const setAdded = (value: boolean) => {
    added.value = value
  }

  const setNavList = (list: NavItem[]) => {
    navList.value = list
  }

  const setCurrNav = (value: string) => {
    currNav.value = value
    localStorage.setItem('currNav', value)
  }

  const setCurrNavTitle = (value: string) => {
    currNavTitle.value = value
  }

  const setTagsList = (list: any[]) => {
    tagsList.value = [...tagsList.value, ...list]
  }

  const updateMenulist = (routes: MenuItem[]) => {
    menuList.value = routes.filter((item) => item.children && item.children.length > 0)
  }

  const closePage = (name: string) => {
    const index = cachePage.value.indexOf(name)
    if (index > -1) {
      cachePage.value.splice(index, 1)
    }
  }

  const initCachePage = () => {
    const cache = localStorage.getItem('cachePage')
    if (cache) {
      cachePage.value = JSON.parse(cache)
    }
  }

  const removeTag = (name: string) => {
    const index = pageOpenedList.value.findIndex((item) => item.name === name)
    if (index > -1) {
      pageOpenedList.value.splice(index, 1)
    }
  }

  const updatePageOpenedList = (index: number, argu?: any, query?: any) => {
    const openedPage = pageOpenedList.value[index]
    if (argu) {
      openedPage.argu = argu
    }
    if (query) {
      openedPage.query = query
    }
    pageOpenedList.value.splice(index, 1, openedPage)
    localStorage.setItem('pageOpenedList', JSON.stringify(pageOpenedList.value))
  }

  const clearAllTags = () => {
    pageOpenedList.value.splice(1)
    cachePage.value = []
    localStorage.setItem('pageOpenedList', JSON.stringify(pageOpenedList.value))
  }

  const clearOtherTags = (currentName: string) => {
    const currentIndex = pageOpenedList.value.findIndex((item) => item.name === currentName)
    if (currentIndex === 0) {
      pageOpenedList.value.splice(1)
    } else {
      pageOpenedList.value.splice(currentIndex + 1)
      pageOpenedList.value.splice(1, currentIndex - 1)
    }
    cachePage.value = cachePage.value.filter((item) => item === currentName)
    localStorage.setItem('pageOpenedList', JSON.stringify(pageOpenedList.value))
  }

  const setOpenedList = (defaultPage?: PageTag) => {
    const stored = localStorage.getItem('pageOpenedList')
    if (stored) {
      pageOpenedList.value = JSON.parse(stored)
    } else if (defaultPage) {
      pageOpenedList.value = [defaultPage]
    }
  }

  const setAvatarPath = (path: string) => {
    localStorage.setItem('avatorImgPath', path)
  }

  const switchLang = (langValue: string) => {
    lang.value = langValue
    localStorage.setItem('lang', langValue)
  }

  const setMessageCount = (count: number) => {
    messageCount.value = count
  }

  const setNotices = (noticesData: any) => {
    notices.value = noticesData
  }

  const increateTag = (tagObj: PageTag) => {
    if (!dontCache.value.includes(tagObj.name)) {
      cachePage.value.push(tagObj.name)
      localStorage.setItem('cachePage', JSON.stringify(cachePage.value))
    }
    pageOpenedList.value.push(tagObj)
    localStorage.setItem('pageOpenedList', JSON.stringify(pageOpenedList.value))
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const updateAppRouter = (routes: RouteRecordNormalized[]) => {
    routers.value.push(...routes)
  }

  const updateDefaultRouter = () => {
    // 在 router 中处理
  }

  return {
    styleStore,
    added,
    navList,
    currNav,
    currNavTitle,
    cachePage,
    lang,
    pageOpenedList,
    hotWords,
    menuList,
    tagsList,
    routers,
    messageCount,
    loading,
    dontCache,
    notices,
    setAdded,
    setNavList,
    setCurrNav,
    setCurrNavTitle,
    setTagsList,
    updateMenulist,
    closePage,
    initCachePage,
    removeTag,
    updatePageOpenedList,
    clearAllTags,
    clearOtherTags,
    setOpenedList,
    setAvatarPath,
    switchLang,
    setMessageCount,
    setNotices,
    increateTag,
    setLoading,
    updateAppRouter,
    updateDefaultRouter
  }
})

export default useAppStore
export { useAppStore }

