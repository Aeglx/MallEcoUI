import { getCurrentPermissionList } from '@/api/index'
import lazyLoading from './lazyLoading'
import Cookies from 'js-cookie'
import type { Router } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { NavItem, PageTag } from '@/stores/app'
import { getStore } from './storage'

const util = {
  title(title?: string) {
    title = title || '运营后台'
    window.document.title = title
  },

  // 判断元素是否存在于数组中
  oneOf(ele: any, targetArr: any[]): boolean {
    return targetArr.indexOf(ele) >= 0
  },

  // 打开新的页面
  openNewPage(_vm: any, name: string, argu?: any, query?: any) {
    const appStore = useAppStore()
    const pageOpenedList = appStore.pageOpenedList
    const openedPageLen = pageOpenedList.length
    let i = 0
    let tagHasOpened = false

    while (i < openedPageLen) {
      if (name === pageOpenedList[i].name) {
        // 页面已经打开
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

      // 404路由需要和动态路由一起加载
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

      // 判断用户是否登录
      const userInfo = Cookies.get('userInfoManager')
      if (!userInfo) {
        reject(new Error('用户未登录'))
        return
      }

      if (!appStore.added) {
        // 第一次加载 读取数据
        getCurrentPermissionList().then((res: any) => {
          if (!res.success) {
            console.error('❌ 获取权限列表失败:', res)
            reject(new Error('获取权限列表失败: ' + (res.message || '未知错误')))
            return
          }
          let menuData = res.result

          // 格式化数据，设置 空children 为 null
          // 确保菜单数据格式正确
          if (!Array.isArray(menuData)) {
            reject(new Error('菜单数据格式错误：期望数组'))
            return
          }
          
          for (let i = 0; i < menuData.length; i++) {
            // 确保有 children 属性
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
                    // 给所有三级路由添加字段，显示一级菜单name，方便点击页签时的选中筛选
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
          util.initRouterNode(otherRoutes, otherRouter, false) // otherRouter 是顶级路由

          // 添加所有主界面路由
          // 注意：constRoutes 中的路由有 children，需要将 children 逐个添加到 otherRouter
          const filteredRoutes = constRoutes.filter((item) => item.children && item.children.length > 0)
          filteredRoutes.forEach((route) => {
            // 将 route 的 children 逐个添加到 otherRouter，而不是添加整个 route 对象
            if (route.children && Array.isArray(route.children)) {
              route.children.forEach((childRoute: any) => {
                router.addRoute('otherRouter', childRoute)
              })
            }
          })
          appStore.updateAppRouter(filteredRoutes)

          // 添加全局路由（顶级路由）
          otherRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 添加菜单路由（作为 otherRouter 的子路由）
          util.initMenuData(menuData, router)

          // 缓存数据 修改加载标识
          window.localStorage.setItem('menuData', JSON.stringify(menuData))
          appStore.setAdded(true)
          
          // 路由初始化完成
          resolve()
        }).catch((err) => {
          reject(err)
        })
      } else {
        // 读取缓存数据
        const data = window.localStorage.getItem('menuData')
        if (!data) {
          appStore.setAdded(false)
          reject(new Error('菜单数据缓存不存在'))
          return
        }
        const menuData = JSON.parse(data)
        // 添加菜单路由
        util.initMenuData(menuData, router)
        resolve()
      }
    })
  },

  // 添加所有顶部导航栏下的菜单路由
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

  // 生成菜单格式数据
  initMenuData(menuData: any[], router: Router) {
    const appStore = useAppStore()
    const menuRoutes: any[] = []

    // 顶部菜单
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

    // 存入 store
    appStore.setNavList(navList)
    let currNav = window.localStorage.getItem('currNav')
    if (currNav) {
      // 读取缓存title
      for (const item of navList) {
        if (item.name === currNav) {
          appStore.setCurrNavTitle(item.title)
          break
        }
      }
    } else {
      // 默认第一个
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

    // 递归处理所有子路由（包括二级和三级菜单）
    // 只有 type === 1（页面）的路由才会被添加到 router 中
    util.initRouterNode(menuRoutes, filteredMenuData, true) // 作为 otherRouter 的子路由
    
    if (menuRoutes.length === 0) {
      console.warn(`⚠️ 警告：没有生成任何路由，请检查菜单数据结构`)
      return
    }

    // 添加路由到 router
    let successCount = 0
    let failCount = 0
    const failedRoutes: any[] = []
    
    menuRoutes.forEach((route) => {
      // 确保路由配置正确
      if (!route.path) {
        console.error(`❌ 路由缺少 path:`, { name: route.name, frontRoute: route.meta?.frontRoute })
        failCount++
        failedRoutes.push({ name: route.name, path: route.path, reason: '缺少path' })
        return
      }
      
      // 确保有组件
      if (!route.component) {
        console.error(`❌ 路由缺少 component:`, { name: route.name, path: route.path })
        failCount++
        failedRoutes.push({ name: route.name, path: route.path, reason: '缺少component' })
        return
      }
      
      // 确保 meta 中有 frontRoute
      if (!route.meta) route.meta = {}
      if (!route.meta.frontRoute) {
        if (route.frontRoute) {
          route.meta.frontRoute = route.frontRoute
        } else if (route.path) {
          route.meta.frontRoute = route.path
        }
      }
      
      // 验证路径格式（子路由应该是相对路径，不以 / 开头）
      if (route.path.startsWith('/') && route.path !== '/') {
        route.path = route.path.substring(1)
      }
      
      try {
        // 检查路由对象结构（只检查第一个路由，避免日志过多）
        if (menuRoutes.indexOf(route) === 0) {
          console.log('🔍 第一个路由对象结构:', {
            name: route.name,
            path: route.path,
            hasComponent: !!route.component,
            componentType: typeof route.component,
            hasMeta: !!route.meta,
            metaKeys: route.meta ? Object.keys(route.meta) : [],
            allKeys: Object.keys(route),
            routeObject: route
          })
        }
        
        // 确保路由对象符合 Vue Router 的要求
        const routeToAdd: any = {
          name: route.name,
          path: route.path,
          component: route.component,
          meta: route.meta || {}
        }
        
        // 添加路由前检查 otherRouter 的状态
        const beforeRoutes = router.getRoutes()
        const beforeOtherRouter = beforeRoutes.find((r: any) => r.name === 'otherRouter')
        const beforeChildrenCount = beforeOtherRouter?.children?.length || 0
        
        // 使用清理后的路由对象添加路由
        router.addRoute('otherRouter', routeToAdd)
        
        // 添加路由后立即检查 otherRouter 的状态
        const afterRoutes = router.getRoutes()
        const afterOtherRouter = afterRoutes.find((r: any) => r.name === 'otherRouter')
        const afterChildrenCount = afterOtherRouter?.children?.length || 0
        
        // 检查路由是否真的被添加了
        const addedRoute = afterOtherRouter?.children?.find((r: any) => r.name === route.name)
        if (!addedRoute && afterChildrenCount === beforeChildrenCount) {
          // 路由没有被添加，但也没有报错
          console.warn(`⚠️ 路由添加后未找到: ${route.name}, path: ${route.path}, before: ${beforeChildrenCount}, after: ${afterChildrenCount}`)
          failCount++
          failedRoutes.push({ name: route.name, path: route.path, reason: '添加后未找到' })
        } else {
          successCount++
        }
      } catch (error: any) {
        failCount++
        failedRoutes.push({ name: route.name, path: route.path, reason: error?.message || '未知错误' })
        console.error(`❌ 路由添加失败:`, { name: route.name, path: route.path, error: error?.message || error })
      }
    })
    
    // 输出统计信息
    if (failCount > 0 || successCount > 0) {
      console.log(`📊 路由添加统计: 成功 ${successCount} 个，失败 ${failCount} 个，总计 ${menuRoutes.length} 个`)
      if (failCount > 0) {
        console.error(`❌ 失败的路由:`, failedRoutes)
      }
      // 立即验证添加结果（同步检查）
      const immediateRoutes = router.getRoutes()
      const immediateOtherRouter = immediateRoutes.find((r: any) => r.name === 'otherRouter')
      const immediateChildrenCount = immediateOtherRouter?.children?.length || 0
      console.log(`📊 立即验证（同步）: otherRouter.children 数量 = ${immediateChildrenCount}`)
      if (successCount > 0 && immediateChildrenCount < successCount + 3) {
        console.error(`❌ 路由添加后数量不匹配: 期望至少 ${successCount + 3} 个，实际 ${immediateChildrenCount} 个`)
        if (menuRoutes.length > 0) {
          console.error(`❌ 第一个路由对象结构:`, {
            name: menuRoutes[0].name,
            path: menuRoutes[0].path,
            hasComponent: !!menuRoutes[0].component,
            hasMeta: !!menuRoutes[0].meta,
            keys: Object.keys(menuRoutes[0])
          })
        }
      }
    }
    
    // 验证路由是否正确添加（只显示失败和缺失的路由）
    setTimeout(() => {
      const allRoutes = router.getRoutes()
      const otherRouterRoute = allRoutes.find(r => r.name === 'otherRouter')
      
      if (!otherRouterRoute) {
        console.error(`❌ otherRouter 路由不存在`)
        return
      }
      
      const childrenCount = otherRouterRoute.children?.length || 0
      if (childrenCount === 0) {
        console.error(`❌ otherRouter 没有 children，但期望添加 ${menuRoutes.length} 个路由`)
        console.error(`❌ 尝试添加的路由名称 (前5个):`, menuRoutes.slice(0, 5).map((r: any) => ({ name: r.name, path: r.path })))
        return
      }
      
      const allChildren = otherRouterRoute.children.map((r: any) => ({
        name: r.name,
        path: r.path || '',
      }))
      
      // 对比期望的路由数量（使用 name 匹配）
      const matchedRoutes = menuRoutes.filter(menuRoute => {
        return allChildren.some((child: any) => child.name === menuRoute.name)
      })
      
      if (matchedRoutes.length < menuRoutes.length) {
        const missingRoutes = menuRoutes.filter(menuRoute => {
          return !allChildren.some((child: any) => child.name === menuRoute.name)
        })
        console.error(`❌ 路由匹配失败: 期望 ${menuRoutes.length} 个，实际匹配 ${matchedRoutes.length} 个，otherRouter.children 总数 ${childrenCount}`)
        console.error(`❌ 缺失的路由 (前5个):`, missingRoutes.slice(0, 5).map((r: any) => ({ name: r.name, path: r.path })))
        if (missingRoutes.length > 5) {
          console.error(`❌ ... 还有 ${missingRoutes.length - 5} 个缺失的路由`)
        }
        console.error(`❌ 实际存在的路由名称:`, allChildren.map((r: any) => r.name))
      }
    }, 300)

      // 刷新界面菜单
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

    // 更新标签列表
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

  // 生成路由节点
  // 只有 type === 1（页面）的菜单项才会生成实际路由
  // type === 0（目录）只作为容器，不生成路由，但会递归处理其 children
  initRouterNode(routers: any[], data: any[], isChildRoute: boolean = false) {
    for (const item of data) {
      // 检查菜单类型：type 0 = 目录，type 1 = 页面
      const itemType = typeof item.type !== 'undefined' ? item.type : undefined
      const isDirectory = itemType === 0
      
      // 如果是目录（type === 0），只处理其 children，不创建路由本身
      if (isDirectory && item.children && item.children.length > 0) {
        // 递归处理子菜单
        util.initRouterNode(routers, item.children, isChildRoute)
        continue // 跳过目录本身，不创建路由
      }
      
      // 如果是页面（type === 1）或没有 type 字段（兼容处理），创建路由
      const menu: any = { ...item }

      // 保存原始路径用于 frontRoute 推断
      const originalPath = item.path || menu.path

      // 处理路径：Vue Router 路径格式要求
      if (menu.path) {
        // 特殊路径（如 /:pathMatch(.*)*）保持不变
        if (menu.path.includes(':') || menu.path.includes('*')) {
          // 参数路由或通配符路由，保持原样
          // 这些通常是顶级路由，已经以 / 开头
        } else if (isChildRoute) {
          // 子路由：去掉开头的 /（作为相对路径）
          // 但保留完整的路径结构，例如：admin/member/recharge
          if (menu.path.startsWith('/')) {
            menu.path = menu.path.substring(1)
          }
          // 确保路径格式正确（不包含多余的前缀）
          // 如果路径是 /admin/member/recharge，处理后应该是 admin/member/recharge
          // Vue Router 会将它与父路由（/）组合成 /admin/member/recharge
        } else {
          // 顶级路由：确保以 / 开头
          if (!menu.path.startsWith('/')) {
            menu.path = '/' + menu.path
          }
        }
      }

      // 确保 meta 中有 frontRoute（在设置 component 之前）
      if (!menu.meta) menu.meta = {}
      
      // 确定 frontRoute：优先使用 menu.frontRoute，如果没有则从原始 path 推断
      let finalFrontRoute = menu.frontRoute || item.frontRoute
      if (!finalFrontRoute && originalPath) {
        // 从原始 path 推断 frontRoute（去掉开头的 /）
        finalFrontRoute = originalPath.startsWith('/') 
          ? originalPath.substring(1) 
          : originalPath
      }
      
      // 设置到 meta 中（确保组件可以获取到）
      if (finalFrontRoute) {
        menu.meta.frontRoute = finalFrontRoute
      } else {
        // 如果没有 frontRoute，尝试从处理后的 path 推断
        if (menu.path) {
          menu.meta.frontRoute = menu.path
          finalFrontRoute = menu.path
        }
      }
      
      // 加载页面组件
      if (finalFrontRoute) {
        // 使用 frontRoute 加载组件（如果找不到会自动生成）
        menu.component = lazyLoading(finalFrontRoute)
      } else {
        // 如果都没有，使用占位页面
        console.warn(`⚠️ 路由 ${menu.name || menu.path || 'unknown'} 没有 frontRoute，使用占位页面`)
        menu.component = () => import('@/views/placeholder.vue')
      }

      // 处理子路由（递归）
      // 注意：只有目录（type === 0）才会有 children 需要递归处理
      // 页面（type === 1）不应该有 children
      if (item.children && item.children.length > 0) {
        // 重新获取类型（因为 menu 已经被修改）
        const currentType = typeof menu.type !== 'undefined' ? menu.type : undefined
        const isPageType = currentType === 1
        
        if (isPageType) {
          // 是页面类型，不应该有 children，跳过
          console.warn(`⚠️ 路由 ${menu.name || menu.path} 类型为页面但仍有 children，跳过子路由处理`)
        } else {
          // 是目录或未知类型，递归处理子路由
          // 注意：这里递归处理，但不会在 menu.children 中保存，而是直接添加到 routers
          // 因为子路由应该和父路由平级（都是 otherRouter 的子路由）
          util.initRouterNode(routers, item.children, isChildRoute)
        }
      }

      // 合并 meta 信息，不要覆盖已有的 meta（特别是 frontRoute）
      if (!menu.meta) menu.meta = {}
      // 给页面添加标题、父级菜单name（方便左侧菜单选中）
      menu.meta.title = menu.title ? menu.title + ' - 运营后台' : null
      menu.meta.firstRouterName = item.firstRouterName
      
      // 确保 frontRoute 存在（如果没有，尝试从 path 推断）
      if (!menu.meta.frontRoute) {
        if (menu.frontRoute) {
          menu.meta.frontRoute = menu.frontRoute
        } else if (menu.path) {
          // 从 path 推断 frontRoute（去掉开头的 /）
          let pathStr = menu.path.replace(/^\//, '')
          menu.meta.frontRoute = pathStr
        }
      }
      
      // 将完整的菜单项信息保存到 meta 中，供页面配置生成器使用
      // 这样可以根据菜单的具体信息生成更准确的页面配置
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
        // 保留其他可能的菜单属性
        ...item
      }
      
      // 确保路由有 name（用于路由匹配和调试）
      if (!menu.name) {
        if (menu.path) {
          // 从路径生成路由名称：admin/member/recharge -> admin-member-recharge
          // 注意：此时 path 已经是处理后的格式（去掉了开头的 /）
          menu.name = menu.path.replace(/\//g, '-')
        } else if (menu.meta.frontRoute) {
          // 从 frontRoute 生成路由名称
          menu.name = menu.meta.frontRoute.replace(/\//g, '-')
        } else if (item.name) {
          // 使用原始名称
          menu.name = item.name
        }
      }
      
      // 最终验证和调试信息（开发环境）
      if (process.env.NODE_ENV === 'development') {
        const routeInfo = {
          name: menu.name,
          path: menu.path,
          frontRoute: menu.meta?.frontRoute,
          hasComponent: !!menu.component,
          isChildRoute
        }
        
        if (!menu.component) {
          console.error(`❌ 路由配置错误:`, routeInfo, menu)
        } else if (!menu.meta?.frontRoute) {
          console.warn(`⚠️ 路由缺少 frontRoute:`, routeInfo)
        } else if (!menu.path) {
          console.error(`❌ 路由缺少 path:`, routeInfo)
        }
      }

      routers.push(menu)
    }
  }
}

/**
 * 获取用户 token
 * @returns token 字符串
 */
export function getToken(): string {
  return getStore('accessToken') || ''
}

export default util

