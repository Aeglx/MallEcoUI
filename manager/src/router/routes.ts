import type { RouteRecordRaw } from 'vue-router'
import config from '@/config'

// 不作为Main组件的子页面展示的页面单独写
export const loginRouter: RouteRecordRaw = {
  path: '/login',
  name: 'login',
  meta: {
    title: `登录 - ${config.title}运营后台`
  },
  component: () => import('@/views/login.vue')
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter: RouteRecordRaw = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: () => import('@/views/Main.vue'),
  children: [
    {
      path: 'home',
      name: 'home_index',
      meta: {
        title: '首页'
      },
      component: () => import('@/views/home/home.vue')
    },
    {
      path: 'personal-center',
      name: 'personal-center',
      meta: { title: '个人中心' },
      component: () => import('@/views/personal-center/personal-center.vue')
    },
    {
      path: 'change-password',
      name: 'change_password',
      meta: { title: '修改密码' },
      component: () => import('@/views/change-password/change-password.vue')
    },
    // 业务页面已全部改为自动生成，动态路由会在 util.ts 中通过菜单数据自动添加
    // 其他路由将在动态路由中添加
  ]
}

export const page404: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
}

export const page403: RouteRecordRaw = {
  path: '/403',
  name: 'error-403',
  meta: {
    title: '403-权限不足'
  },
  component: () => import('@/views/error-page/403.vue')
}

export const page500: RouteRecordRaw = {
  path: '/500',
  name: 'error-500',
  meta: {
    title: '500-服务端错误'
  },
  component: () => import('@/views/error-page/500.vue')
}

export const externalLink: RouteRecordRaw = {
  path: '/external-link',
  name: 'external-link',
  meta: {
    title: '外部链接'
  },
  component: () => import('@/views/external-link/index.vue')
}

// 所有基础路由
export const constantRoutes: RouteRecordRaw[] = [
  loginRouter,
  otherRouter,
  page500,
  page403,
  externalLink
]

