<template>
  <div class="main">
    <!-- 简化版主布局 -->
    <div class="main-header-con">
      <div class="main-header">
        <div class="header-content">
          <div class="logo">卖家后台</div>
          <div class="user-info">
            <span>{{ userInfo.nickName || userInfo.nickname || '卖家' }}</span>
            <el-dropdown @command="handleClickUserDropdown">
              <el-avatar :src="avatarPath" style="margin-left: 10px; cursor: pointer;">
                <el-icon><User /></el-icon>
              </el-avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item command="changePass">修改密码</el-dropdown-item>
                  <el-dropdown-item divided command="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="single-page-con">
      <div class="single-page">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { User } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import util from '@/libs/util'
import { logout } from '@/api/index'
import { setStore } from '@/libs/storage'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const userInfo = ref<any>('')
const avatarPath = computed(() => localStorage.getItem('avatorImgPath') || '')

const handleClickUserDropdown = (command: string) => {
  if (command === 'personalCenter') {
    util.openNewPage({}, 'personal-center')
    router.push({ name: 'personal-center' })
  } else if (command === 'changePass') {
    util.openNewPage({}, 'change-password')
    router.push({ name: 'change_password' })
  } else if (command === 'loginOut') {
    logout().then((res: any) => {
      userStore.logout()
      appStore.setAdded(false)
      setStore('accessToken', '')
      setStore('refreshToken', '')
      router.push({ path: '/login' })
    })
  }
}

onMounted(() => {
  const userInfoStr = Cookies.get('userInfoSeller')
  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr)
  }
  
  appStore.setOpenedList({
    title: '首页',
    path: '',
    name: 'home_index'
  })
})
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  
  .main-header-con {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    
    .main-header {
      height: 60px;
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 0 20px;
        
        .logo {
          font-size: 18px;
          font-weight: bold;
        }
        
        .user-info {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .single-page-con {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    
    .single-page {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

