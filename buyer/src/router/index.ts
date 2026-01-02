import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import storage from '@/utils/storage'

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
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('@/pages/SignUp.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: () => import('@/pages/ForgetPassword.vue'),
    meta: {
      title: '忘记密码'
    }
  },
  {
    path: '/goodsList',
    name: 'GoodsList',
    component: () => import('@/pages/GoodsList.vue'),
    meta: {
      title: '商品列表'
    }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: () => import('@/pages/GoodsDetail.vue'),
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/Cart.vue'),
    meta: {
      title: '购物车',
      requiresAuth: true
    }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/pages/Pay.vue'),
    meta: {
      title: '支付页面',
      requiresAuth: true
    }
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('@/pages/Article.vue'),
    meta: {
      title: '帮助中心'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home/Home.vue'),
    meta: {
      title: '会员中心',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'UserMain',
        component: () => import('@/pages/home/userCenter/UserMain.vue'),
        meta: {
          title: '会员中心'
        }
      },
      {
        path: 'MyOrder',
        name: 'MyOrder',
        component: () => import('@/pages/home/orderCenter/MyOrder.vue'),
        meta: {
          title: '我的订单'
        }
      },
      {
        path: 'MyAddress',
        name: 'MyAddress',
        component: () => import('@/pages/home/orderCenter/MyAddress.vue'),
        meta: {
          title: '收货地址'
        }
      },
      {
        path: 'AfterSale',
        name: 'AfterSale',
        component: () => import('@/pages/home/orderCenter/AfterSale.vue'),
        meta: {
          title: '售后订单'
        }
      },
      {
        path: 'Profile',
        name: 'Profile',
        component: () => import('@/pages/home/memberCenter/Profile.vue'),
        meta: {
          title: '用户信息'
        }
      },
      {
        path: 'AccountSafe',
        name: 'AccountSafe',
        component: () => import('@/pages/home/memberCenter/AccountSafe.vue'),
        meta: {
          title: '账户安全'
        }
      },
      {
        path: 'MyTracks',
        name: 'MyTracks',
        component: () => import('@/pages/home/userCenter/MyTracks.vue'),
        meta: {
          title: '我的足迹'
        }
      },
      {
        path: 'Favorites',
        name: 'Favorites',
        component: () => import('@/pages/home/memberCenter/Favorites.vue'),
        meta: {
          title: '我的收藏'
        }
      },
      {
        path: 'Coupons',
        name: 'Coupons',
        component: () => import('@/pages/home/userCenter/Coupons.vue'),
        meta: {
          title: '我的优惠券'
        }
      },
      {
        path: 'MoneyManagement',
        name: 'MoneyManagement',
        component: () => import('@/pages/home/userCenter/MoneyManagement.vue'),
        meta: {
          title: '资金管理'
        }
      },
      {
        path: 'ModifyPwd',
        name: 'ModifyPwd',
        component: () => import('@/pages/home/memberCenter/ModifyPwd.vue'),
        meta: {
          title: '修改密码'
        }
      },
      {
        path: 'OrderDetail',
        name: 'OrderDetail',
        component: () => import('@/pages/home/orderCenter/OrderDetail.vue'),
        meta: {
          title: '订单详情'
        }
      }
    ]
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

  // 检查是否需要登录（登录页、注册页、忘记密码页不需要检查）
  if (to.meta?.requiresAuth && !['/login', '/signUp', '/forgetPassword'].includes(to.path)) {
    const token = storage.getItem('accessToken')
    if (!token) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: {
          rePath: to.fullPath,
          query: JSON.stringify(to.query)
        }
      })
      return
    }
  }

  next()
})

export default router
