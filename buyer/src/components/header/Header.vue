<template>
  <div class="box">
    <div class="nav width_1200_auto">
      <ul class="location flex">
        <li v-if="$route.path.includes('home')" style="margin-left: 10px">
          <router-link to="/">首页</router-link>
        </li>
        <ul class="flex">
          <li>Hi，欢迎来到{{ siteName }}</li>
          <li class="first" v-show="!isLoggedIn">
            <router-link :to="`/signUp`" class="nav-item">
              <span>立即注册</span>
            </router-link>
          </li>
          <li v-show="!isLoggedIn">
            <router-link
              class="nav-item"
              :to="`/login?rePath=${$route.path}&query=${JSON.stringify($route.query)}`"
            >
              <span>请登录</span>
            </router-link>
          </li>
        </ul>
      </ul>
      <ul class="detail flex">
        <li v-show="isLoggedIn">
          <div class="username-p">
            <div @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
              <el-avatar
                class="person-icon"
                :src="avatar"
                :size="20"
                :icon="UserFilled"
              />
              <span class="username">{{
                userInfo?.nickName || userInfo?.username || ''
              }}</span>
            </div>
            <transition name="fade">
              <ul class="drop-items" v-show="showDropdown">
                <li @click="goUserCenter('/home')">我的主页</li>
                <li @click="goUserCenter('/home/Coupons')">优惠券</li>
                <li @click="goUserCenter('/home/Favorites')">我的收藏</li>
                <li @click="signOutFun">退出登录</li>
              </ul>
            </transition>
          </div>
        </li>
        <li @click="goUserCenter('/home/MyOrder')">
          <span class="nav-item">我的订单</span>
        </li>
        <li @click="goUserCenter('/home/MyTracks')">
          <span class="nav-item">我的足迹</span>
        </li>
        <li @click="goUserCenter('/home/MsgList')">
          <span class="nav-item">我的消息</span>
        </li>
        <li v-if="$route.name !== 'Cart'" style="position: relative">
          <el-dropdown
            placement="bottom-start"
            @visible-change="handleCartVisible"
            trigger="hover"
          >
            <router-link to="/cart" target="_blank">
              <span class="nav-item">
                <el-icon><ShoppingCart /></el-icon>
                购物车（{{ cartNum < 100 ? cartNum : '99+' }}）
              </span>
            </router-link>
            <template #dropdown>
              <el-dropdown-menu>
                <div
                  class="shopping-cart-null"
                  style="width: 200px"
                  v-show="shoppingCart.length <= 0"
                >
                  <el-icon class="cart-null-icon"><ShoppingCart /></el-icon>
                  <span>你的购物车没有宝贝哦</span>
                  <span>赶快去添加商品吧~</span>
                </div>
                <div
                  class="shopping-cart-list"
                  v-show="shoppingCart.length > 0"
                >
                  <div
                    class="shopping-cart-box"
                    v-for="(item, index) in shoppingCart"
                    :key="index"
                    @click="goToPay"
                  >
                    <div class="shopping-cart-img">
                      <img
                        :src="item.goodsSku?.thumbnail"
                        class="hover-pointer"
                        alt=""
                      />
                    </div>
                    <div class="shopping-cart-info">
                      <div class="shopping-cart-title">
                        <p class="hover-pointer goods-title ellipsis">
                          {{ item.goodsSku?.goodsName }}
                        </p>
                      </div>
                      <div class="shopping-cart-detail">
                        <div>
                          数量:
                          <span class="shopping-cart-text">{{ item.num }}</span>
                        </div>
                        <div class="shopping-price">
                          ¥{{ item.purchasePrice }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <span class="nav-item" @click="shopEntry">店铺入驻</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, ShoppingCart } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { cartGoodsAll } from '@/api/cart'
import storage from '@/utils/storage'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const showDropdown = ref(false)
const shoppingCart = ref<any[]>([])
const siteName = ref<string>('MallEco 购物商城')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const avatar = computed(() => userStore.avatar)
const cartNum = computed(() => cartStore.cartNum)

const goToPay = () => {
  const url = router.resolve({
    path: '/cart'
  })
  window.open(url.href, '_blank')
}

const signOutFun = async () => {
  try {
    await userStore.logout()
    cartStore.clearCart()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

const goUserCenter = (path: string) => {
  if (isLoggedIn.value) {
    router.push({ path })
  } else {
    ElMessageBox.confirm('请登录后执行此操作', '提示', {
      confirmButtonText: '立即登录',
      cancelButtonText: '继续浏览',
      type: 'warning'
    })
      .then(() => {
        router.push({
          path: '/login',
          query: {
            rePath: route.path,
            query: JSON.stringify(route.query)
          }
        })
      })
      .catch(() => {})
  }
}

const shopEntry = () => {
  if (storage.getItem('accessToken')) {
    const routeUrl = router.resolve({
      path: '/shopEntry',
      query: { id: 1 }
    })
    window.open(routeUrl.href, '_blank')
  } else {
    router.push('/login')
  }
}

const handleCartVisible = (visible: boolean) => {
  if (visible && isLoggedIn.value) {
    getCartList()
  }
}

const getCartList = async () => {
  if (isLoggedIn.value) {
    try {
      const res = await cartGoodsAll()
      const data = res.data || res
      if (data.success && data.result) {
        shoppingCart.value = data.result.skuList || []
        cartStore.setCartNum(shoppingCart.value.length)
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
    }
  }
}

onMounted(() => {
  const storedSiteName = storage.getItem('siteName')
  if (storedSiteName) {
    siteName.value = storedSiteName
  }
  
  // 初始化购物车数量
  if (isLoggedIn.value) {
    cartStore.fetchCartCount()
  }
})

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    cartStore.fetchCartCount()
  } else {
    shoppingCart.value = []
  }
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  font-size: 12px !important;
  height: 36px;
  background: #333;
  color: #fff;
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.nav ul {
  list-style: none;
}

.nav li {
  cursor: pointer;
  float: left;
  line-height: 36px;
  margin-right: 15px;
}

.nav a,
.nav-item {
  font-size: 13px;
  font-weight: normal;
  text-decoration: none;
  cursor: pointer;
  color: #fff;
}

.nav-item {
  padding-left: 20px;
}

.location a {
  border-left: none;
}

.person-icon {
  color: #f31947;
  background-color: #f0cdb2;
}

.shopping-cart-img {
  margin-right: 15px;
  width: 40px;
  height: 40px;
}

.shopping-cart-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shopping-cart-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  width: 200px;
  overflow: hidden;
  font-size: 12px;
  line-height: 20px;
}

.shopping-cart-null {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cart-null-icon {
  font-size: 38px;
  margin-bottom: 15px;
}

.shopping-cart-null span {
  font-size: 12px;
  line-height: 16px;
}

.username-p {
  position: relative;

  > div {
    cursor: pointer;

    > span {
      margin-left: 5px;
    }
  }

  .drop-items {
    position: absolute;
    display: block;
    top: 45px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 5px 10px;
    z-index: 20;
    height: 150px;
    background-color: #fff;
    width: 80px;
    border: 1px solid #eee;
    box-shadow: 2px 2px 7px #999;

    li {
      color: rgb(107, 106, 106);
      width: 100%;
      border-bottom: 1px solid rgb(207, 206, 206);
      font-weight: normal;
      text-align: center;
      padding: 5px 0;

      &:last-child {
        border: none;
      }

      &:hover {
        cursor: pointer;
        color: #f31947;
      }
    }

    &::before {
      position: absolute;
      top: -20px;
      left: 30px;
      content: '';
      width: 0;
      height: 0;
      border: 10px solid #999;
      border-color: transparent transparent #fff transparent;
    }

    &::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 20px;
      top: -20px;
      left: 0;
    }
  }
}

.goods-title:hover {
  color: #f31947;
}

.shopping-cart-box {
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px #ccc dotted;
}

.shopping-cart-list {
  padding: 10px 10px;
  box-sizing: border-box;
  max-height: 300px;
  overflow-y: scroll;
  color: #333;
}

.shopping-cart-detail {
  color: #999;
  font-size: 12px;
}

.shopping-price {
  color: #f31947;
  font-size: 14px;
  font-weight: bold;
}

.flex {
  display: flex;
  align-items: center;
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}

.hover-pointer {
  cursor: pointer;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

