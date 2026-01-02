import { getCurrentPermissionList } from '@/api/index'
import lazyLoading from './lazyLoading'
import Cookies from 'js-cookie'
import type { Router } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { NavItem, PageTag } from '@/stores/app'
import { getStore } from './storage'

const util = {
  title(title?: string) {
    title = title || '卖家后台'
    window.document.title = title
  },

  oneOf(ele: any, targetArr: any[]): boolean {
    return targetArr.indexOf(ele) >= 0
  },

  openNewPage(_vm: any, name: string, argu?: any, query?: any) {
    const appStore = useAppStore()
    const pageOpenedList = appStore.pageOpenedList
    const openedPageLen = pageOpenedList.length
    let i = 0
    let tagHasOpened = false

    while (i < openedPageLen) {
      if (name === pageOpenedList[i].name) {
        appStore.updatePageOpenedList(i, argu, query)
        tagHasOpened = true
        break
      }
      i++
    }

    if (!tagHasOpened) {
      const tagsList = appStore.tagsList
      const filteredTags = tagsList.filter((item: any) => {
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          return name === item.children[0].name
        } else {
          return name === item.name
        }
      })
      let tag = filteredTags[0]
      if (tag) {
        const finalTag = (tag.children && Array.isArray(tag.children) && tag.children.length > 0) 
          ? tag.children[0] 
          : tag
        const tagObj: PageTag = {
          title: finalTag.title || '',
          path: finalTag.path || '',
          name: finalTag.name || '',
          argu: argu,
          query: query
        }
        appStore.increateTag(tagObj)
      }
    }
  },

  toDefaultPage(routers: any[], name: string, route: Router, next: any) {
    const len = routers.length
    let i = 0
    let notHandle = true

    while (i < len) {
      if (
        routers[i].name === name &&
        routers[i].children &&
        routers[i].redirect === undefined
      ) {
        route.replace({
          name: routers[i].children[0].name
        })
        notHandle = false
        next()
        break
      }
      i++
    }
    if (notHandle) {
      next()
    }
  },

  initRouter(router: Router): Promise<void> {
    return new Promise((resolve, reject) => {
      const appStore = useAppStore()
      const constRoutes: any[] = []
      const otherRoutes: any[] = []

      const otherRouter = [
        {
          path: '/:pathMatch(.*)*',
          name: 'error-404',
          meta: {
            title: '404-页面不存在'
          },
          frontRoute: 'error-page/404'
        }
      ]

      // 判断用户是否登录 - 使用 seller 的 Cookie 名称
      const userInfo = Cookies.get('userInfoSeller')
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }

      if (!appStore.added) {
        getCurrentPermissionList().then((res: any) => {
          if (!res.success) {
            reject(new Error('获取权限列表失败: ' + (res.message || '未知错误')))
            return
          }
          let menuData = res.result

          if (!Array.isArray(menuData)) {
            reject(new Error('菜单数据格式错误：期望数组'))
            return
          }
          
          for (let i = 0; i < menuData.length; i++) {
            if (!menuData[i].children) {
              menuData[i].children = []
            }
            
            const t = menuData[i].children
            if (Array.isArray(t)) {
              for (let k = 0; k < t.length; k++) {
                if (!t[k].children) {
                  t[k].children = []
                }
                
                const tt = t[k].children
                if (Array.isArray(tt)) {
                  for (let z = 0; z < tt.length; z++) {
                    tt[z].children = null
                    tt[z].firstRouterName = menuData[i].name
                  }
                }
              }
            }
          }

          if (!menuData) {
            reject(new Error('菜单数据为空'))
            return
          }

          util.initAllMenuData(constRoutes, menuData)
          util.initRouterNode(otherRoutes, otherRouter, false)

          const filteredRoutes = constRoutes.filter((item) => item.children && item.children.length > 0)
          filteredRoutes.forEach((route) => {
            router.addRoute('otherRouter', route)
          })
          appStore.updateAppRouter(filteredRoutes)

          otherRoutes.forEach((route) => {
            router.addRoute(route)
          })

          util.initMenuData(menuData, router)

          window.localStorage.setItem('menuData', JSON.stringify(menuData))
          appStore.setAdded(true)
          
          resolve()
        }).catch((err) => {
          reject(err)
        })
      } else {
        const data = window.localStorage.getItem('menuData')
        if (!data) {
          appStore.setAdded(false)
          reject(new Error('菜单数据缓存不存在'))
          return
        }
        const menuData = JSON.parse(data)
        util.initMenuData(menuData, router)
        resolve()
      }
    })
  },

  initAllMenuData(constRoutes: any[], data: any[]) {
    const allMenuData: any[] = []
    data.forEach((e) => {
      if (e.level === 0) {
        e.children.forEach((item: any) => {
          allMenuData.push(item)
        })
      }
    })
    util.initRouterNode(constRoutes, allMenuData)
  },

  initMenuData(menuData: any[], router: Router) {
    const appStore = useAppStore()
    const menuRoutes: any[] = []

    const navList: NavItem[] = []
    menuData.forEach((e) => {
      const nav = {
        name: e.name,
        title: e.title
      }
      navList.push(nav)
    })

    if (navList.length < 1) {
      return
    }

    appStore.setNavList(navList)
    let currNav = window.localStorage.getItem('currNav')
    if (currNav) {
      for (const item of navList) {
        if (item.name === currNav) {
          appStore.setCurrNavTitle(item.title)
          break
        }
      }
    } else {
      currNav = navList[0].name
      appStore.setCurrNavTitle(navList[0].title)
    }
    appStore.setCurrNav(currNav)

    let filteredMenuData = menuData
    for (const item of menuData) {
      if (item.name === currNav) {
        filteredMenuData = item.children
        break
      }
    }

    util.initRouterNode(menuRoutes, filteredMenuData, true)

    menuRoutes.forEach((route) => {
      if (!route.path) {
        console.error(`❌ 路由缺少 path:`, route)
        return
      }
      
      if (!route.component) {
        console.error(`❌ 路由缺少 component:`, route)
        return
      }
      
      if (!route.meta) route.meta = {}
      if (!route.meta.frontRoute) {
        if (route.frontRoute) {
          route.meta.frontRoute = route.frontRoute
        } else if (route.path) {
          route.meta.frontRoute = route.path
        }
      }
      
      if (route.path.startsWith('/') && route.path !== '/') {
        route.path = route.path.substring(1)
      }
      
      try {
        router.addRoute('otherRouter', route)
      } catch (error: any) {
        console.error(`❌ 路由添加失败: ${route.path}`, error?.message || error)
      }
    })

    if (filteredMenuData && filteredMenuData.length > 0) {
      const menuListData = filteredMenuData.map((item: any) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        children: item.children || [],
        frontRoute: item.frontRoute,
        firstRouterName: item.firstRouterName
      }))
      appStore.updateMenulist(menuListData)
    }

    const tagsList: any[] = []
    const routers = appStore.routers
    routers.forEach((item: any) => {
      if (item.children && item.children.length <= 1) {
        tagsList.push(item.children[0])
      } else if (item.children && item.children.length > 1) {
        tagsList.push(...item.children)
      }
    })
    appStore.setTagsList(tagsList)
  },

  initRouterNode(routers: any[], data: any[], isChildRoute: boolean = false) {
    for (const item of data) {
      const itemType = typeof item.type !== 'undefined' ? item.type : undefined
      const isDirectory = itemType === 0
      
      if (isDirectory && item.children && item.children.length > 0) {
        util.initRouterNode(routers, item.children, isChildRoute)
        continue
      }
      
      const menu: any = { ...item }

      const originalPath = item.path || menu.path

      if (menu.path) {
        if (menu.path.includes(':') || menu.path.includes('*')) {
          // 参数路由或通配符路由，保持原样
        } else if (isChildRoute) {
          if (menu.path.startsWith('/')) {
            menu.path = menu.path.substring(1)
          }
        } else {
          if (!menu.path.startsWith('/')) {
            menu.path = '/' + menu.path
          }
        }
      }

      if (!menu.meta) menu.meta = {}
      
      let finalFrontRoute = menu.frontRoute || item.frontRoute
      if (!finalFrontRoute && originalPath) {
        finalFrontRoute = originalPath.startsWith('/') 
          ? originalPath.substring(1) 
          : originalPath
      }
      
      if (finalFrontRoute) {
        menu.meta.frontRoute = finalFrontRoute
      } else {
        if (menu.path) {
          menu.meta.frontRoute = menu.path
          finalFrontRoute = menu.path
        }
      }
      
      if (finalFrontRoute) {
        menu.component = lazyLoading(finalFrontRoute)
      } else {
        console.warn(`⚠️ 路由 ${menu.name || menu.path || 'unknown'} 没有 frontRoute，使用占位页面`)
        menu.component = () => import('@/views/placeholder.vue')
      }

      if (item.children && item.children.length > 0) {
        const currentType = typeof menu.type !== 'undefined' ? menu.type : undefined
        const isPageType = currentType === 1
        
        if (isPageType) {
          console.warn(`⚠️ 路由 ${menu.name || menu.path} 类型为页面但仍有 children，跳过子路由处理`)
        } else {
          util.initRouterNode(routers, item.children, isChildRoute)
        }
      }

      if (!menu.meta) menu.meta = {}
      menu.meta.title = menu.title ? menu.title + ' - 卖家后台' : null
      menu.meta.firstRouterName = item.firstRouterName
      
      if (!menu.meta.frontRoute) {
        if (menu.frontRoute) {
          menu.meta.frontRoute = menu.frontRoute
        } else if (menu.path) {
          let pathStr = menu.path.replace(/^\//, '')
          menu.meta.frontRoute = pathStr
        }
      }
      
      menu.meta.menuItem = {
        id: item.id,
        name: item.name,
        title: item.title,
        path: item.path,
        frontRoute: item.frontRoute || menu.meta.frontRoute,
        level: item.level,
        type: item.type,
        icon: item.icon,
        permission: item.permission,
        description: item.description,
        ...item
      }
      
      if (!menu.name) {
        if (menu.path) {
          menu.name = menu.path.replace(/\//g, '-')
        } else if (menu.meta.frontRoute) {
          menu.name = menu.meta.frontRoute.replace(/\//g, '-')
        } else if (item.name) {
          menu.name = item.name
        }
      }

      routers.push(menu)
    }
  }
}

export function getToken(): string {
  return getStore('accessToken') || ''
}

export default util

