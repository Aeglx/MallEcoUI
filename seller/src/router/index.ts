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

const originalPush = router.push
router.push = function push(location: any) {
  return originalPush.call(this, location).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      return Promise.reject(err)
    }
  })
}

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  util.title(to.meta?.title as string)

  const name = to.name as string

  if (!Cookies.get('userInfoSeller') && name !== 'login') {
    next({
      name: 'login'
    })
  } else if (Cookies.get('userInfoSeller') && name === 'login') {
    util.title()
    next({
      name: 'home_index'
    })
  } else {
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

