import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { constantRoutes } from './routes'
import util from '@/libs/util'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/stores/app'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 解决重复点击菜单会控制台报错bug
const originalPush = router.push
router.push = function push(location: any) {
  return originalPush.call(this, location).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      return Promise.reject(err)
    }
  })
}

// 配置 NProgress
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  util.title(to.meta?.title as string)

  const name = to.name as string

  if (!Cookies.get('userInfoManager') && name !== 'login') {
    // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    })
  } else if (Cookies.get('userInfoManager') && name === 'login') {
    // 判断是否已经登录且前往的是登录页
    util.title()
    next({
      name: 'home_index'
    })
  } else {
    // 初始化路由（动态加载菜单）
    if (name !== 'login') {
      util.initRouter(router)
    }
    next()
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  const appStore = useAppStore()
  util.openNewPage({}, to.name as string, to.params, to.query)
  NProgress.done()
  window.scrollTo(0, 0)
})

export default router

