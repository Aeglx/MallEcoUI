<template>
  <div>
    <Header />
    <div class="container width_1200">
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="side-bar">
            <div class="user-icon">
              <div class="user-img">
                <el-avatar :src="userInfo?.face" :size="96" :icon="UserFilled" />
              </div>
              <p>{{ userInfo?.nickName || userInfo?.username || '未登录' }}</p>
            </div>
            <el-menu
              class="side-menu"
              :default-active="$route.name"
              :default-openeds="['订单中心', '会员中心', '账户中心']"
              @select="onSelect"
            >
              <el-sub-menu
                v-for="(menu, index) in menuList"
                :key="index"
                :index="menu.title"
                v-if="menu.display"
              >
                <template #title>
                  <span>{{ menu.title }}</span>
                </template>
                <el-menu-item
                  v-for="(children, i) in menu.menus"
                  :key="i"
                  :index="children.path"
                >
                  {{ children.title }}
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="content">
            <router-view />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled } from '@element-plus/icons-vue'
import Header from '@/components/header/Header.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

const menuList = [
  {
    icon: '',
    title: '订单中心',
    menus: [
      { icon: '', title: '我的订单', path: 'MyOrder' },
      { icon: '', title: '收货地址', path: 'MyAddress' },
      { icon: '', title: '售后订单', path: 'AfterSale' }
    ],
    display: true
  },
  {
    icon: '',
    title: '会员中心',
    menus: [
      { icon: '', title: '用户信息', path: 'Profile' },
      { icon: '', title: '账户安全', path: 'AccountSafe' },
      { icon: '', title: '我的足迹', path: 'MyTracks' },
      { icon: '', title: '我的收藏', path: 'Favorites' },
      { icon: '', title: '我的积分', path: 'Point' }
    ],
    display: true
  },
  {
    icon: '',
    title: '账户中心',
    menus: [
      { icon: '', title: '我的优惠券', path: 'Coupons' },
      { icon: '', title: '资金管理', path: 'MoneyManagement' }
    ],
    display: true
  }
]

const onSelect = (name: string) => {
  router.push({ name })
}
</script>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  padding: 20px 0;
  min-height: 600px;
}

.width_1200 {
  width: 1200px;
}

.side-bar {
  background: #fff;
  min-height: 600px;
  padding: 20px 0;
}

.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.user-img {
  margin-bottom: 15px;
}

.side-menu {
  border: none;
}

.content {
  background: #fff;
  padding: 20px;
  min-height: 600px;
}
</style>

