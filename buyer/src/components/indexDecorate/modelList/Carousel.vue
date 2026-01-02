<template>
  <div class="model-carousel">
    <div class="nav-body clearfix">
      <!-- 侧边导航占位 -->
      <div class="nav-side"></div>
      <div class="nav-content">
        <!-- 轮播图 -->
        <el-carousel height="333.9px" :interval="5000" :autoplay="true">
          <el-carousel-item v-for="(item, index) in data?.options?.list" :key="index">
            <div class="swiper-img">
              <img
                :src="item.img || item.imageUrl"
                @click="linkTo(item.url || item.linkUrl)"
                class="hover-pointer"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="nav-right">
        <div class="person-msg">
          <div class="user-box" @click="entryControl('/home')">
            <el-avatar
              v-if="userInfo?.face"
              class="user-face"
              :src="userInfo.face"
              :size="70"
            />
            <el-avatar
              v-else
              class="user-face"
              :size="70"
              :icon="UserFilled"
            />
            <div class="welcome">
              Hi, {{ userInfo?.nickName || userInfo?.username || siteName }}
            </div>
          </div>
          <div v-if="userInfo?.id">
            <!-- 已登录，显示会员信息 -->
          </div>
          <div v-else class="flex flex-a-c">
            <div class="btns" @click="router.push('/login')">登录</div>
            <div class="btns sign-up" @click="router.push('/signUp')">注册</div>
          </div>

          <div class="gray-line"></div>
          <div class="icon-list flex flex-j-sb">
            <div
              class="icon-item"
              @click="entryControl(item)"
              :key="index"
              v-for="(item, index) in entranceList"
            >
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
              <div>{{ item.label }}</div>
            </div>
          </div>
          <div class="icon-list flex flex-j-sb">
            <div
              class="icon-item"
              :key="index"
              @click="entryControl(item)"
              v-for="(item, index) in appendList"
            >
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
              <div>{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserFilled, ShoppingCart, Collection, Shop, Location, Service, ChatLineRound, Position, Bell } from '@element-plus/icons-vue'
import storage from '@/utils/storage'

const props = defineProps<{
  data: any
}>()

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const siteName = computed(() => storage.getItem('siteName') || 'MallEco 购物商城')

const entranceList = [
  {
    icon: Collection,
    label: '宝贝收藏',
    path: '/home/Favorites'
  },
  {
    icon: Shop,
    label: '收藏店铺',
    path: '/home/Favorites?type=STORE'
  },
  {
    icon: ShoppingCart,
    label: '购物车',
    path: '/cart'
  },
  {
    icon: Location,
    label: '我的足迹',
    path: '/home/MyTracks'
  }
]

const appendList = [
  {
    icon: Service,
    label: '帮助中心',
    path: '/article'
  },
  {
    icon: ChatLineRound,
    label: '我的评论',
    path: '/home/CommentList'
  },
  {
    icon: Position,
    label: '收货地址',
    path: '/home/MyAddress'
  },
  {
    icon: Bell,
    label: '我的消息',
    path: '/home/MsgList'
  }
]

const linkTo = (url: string) => {
  if (url && typeof url === 'string') {
    if (url.startsWith('/')) {
      router.push(url)
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }
}

const entryControl = (path: string) => {
  if (path.startsWith('/')) {
    const routeUrl = router.resolve(path)
    window.open(routeUrl.href, '_blank')
  } else {
    router.push(path)
  }
}

onMounted(() => {
  if (userStore.isLoggedIn && !userInfo.value) {
    userStore.fetchUserInfo()
  }
})
</script>

<style lang="scss" scoped>
.model-carousel {
  width: 1200px;
  height: 340px;
  overflow: hidden;
  margin: 10px auto 0 auto;
}

.nav-body {
  width: 1200px;
  height: 340px;
  margin: 0px auto;
}

.nav-side {
  height: 334px;
  width: 263.2px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  float: left;
  padding: 0px;
  color: #fff;
}

.nav-content {
  width: 637px;
  margin-left: 10.8px;
  margin-top: 10px;
  height: 333.9px;
  float: left;
  position: relative;
}

.swiper-img {
  overflow: hidden;
  width: 637px;
  height: 329.9px;
}

.hover-pointer {
  width: 637px;
  height: 329.9px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}

.nav-right {
  float: left;
  margin-top: 10px;
  width: 263.2px;
  margin-left: 10px;
  border-radius: 10px;
  background: #ffffff;

  .person-msg {
    cursor: pointer;
    height: 333px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 28px;
    padding-bottom: 25px;

    > .user-box {
      text-align: center;
      cursor: pointer;
    }
  }
}

.user-face {
  margin-bottom: 12px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.welcome {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 13px;
}

.btns {
  margin-top: 21px;
  margin-bottom: 13px;
  width: 77px;
  height: 28px;
  border-radius: 14px;
  opacity: 1;
  font-size: 13px;
  font-weight: normal;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0px;
  color: #ffffff;
  background: $theme_color;
}

.sign-up {
  background: #f39519;
  margin-left: 10px;
}

.gray-line {
  width: 216px;
  height: 1px;
  border: 1px solid #e5e5e5;
  margin-bottom: 13px;
}

.icon-list {
  width: 216px;
  margin-bottom: 10px;
}

.icon-item {
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    font-size: 11px;
    font-weight: normal;
    line-height: 13px;
    text-align: center;
    letter-spacing: 0px;
    color: #666666;
    margin-top: 5px;
  }
}

.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

:deep(.el-carousel__item) {
  text-align: center;
}
</style>
