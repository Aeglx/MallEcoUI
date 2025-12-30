import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/pages/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/topic/:id',
    name: 'Topic',
    component: () => import('@/pages/Topic.vue'),
    meta: {
      title: '专题页面'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = (to.meta?.title as string) || 'MallEco 购物商城'
  next()
})

export default router

