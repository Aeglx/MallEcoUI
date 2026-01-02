<template>
  <div class="cart">
    <Header />
    <div class="width_1200 logo">
      <div>
        <router-link to="/">
          <img :src="logoImg" alt="" />
        </router-link>
        <div>购物车(<span>{{ cartNum }}</span>)</div>
      </div>
    </div>
    <el-divider />

    <!-- 购物车主体 -->
    <div class="cart-content width_1200 center">
      <div class="cart-steps">
        <span :class="stepIndex == 0 ? 'active' : ''">1.我的购物车</span>
        <el-icon><ArrowRight /></el-icon>
        <span :class="stepIndex == 1 ? 'active' : ''">2.填写订单信息</span>
        <el-icon><ArrowRight /></el-icon>
        <span :class="stepIndex == 2 ? 'active' : ''">3.成功提交订单</span>
      </div>

      <!-- 购物车商品列表 -->
      <div class="cart-goods">
        <div class="cart-goods-title">
          <div class="width_60">
            <el-checkbox v-model="allChecked" @change="changeCheckedAll">全选</el-checkbox>
          </div>
          <div class="goods-title">商品</div>
          <div class="width_150">单价（元）</div>
          <div class="width_100">数量</div>
          <div class="width_150">小计</div>
          <div class="width_100">操作</div>
        </div>

        <el-empty v-if="cartList.length === 0" description="购物车空空如也">
          <el-button type="primary" @click="$router.push('/')">去选购</el-button>
        </el-empty>

        <div v-else class="cart-goods-items" v-for="(shop, index) in cartList" :key="index">
          <div class="shop-name">
            <div>
              <el-checkbox
                v-model="shop.checked"
                @change="changeCheckedShop(shop.checked, shop.storeId)"
              ></el-checkbox>
              <span class="go-shop-page" @click="goShopPage(shop.storeId)">{{
                shop.storeName
              }}</span>
            </div>
          </div>

          <div class="cart-item" v-for="(item, itemIndex) in shop.skuList" :key="itemIndex">
            <div class="width_60">
              <el-checkbox
                v-model="item.checked"
                @change="changeCheckedItem(item.checked, item.skuId)"
              ></el-checkbox>
            </div>
            <div class="goods-title">
              <img :src="item.goodsSku.thumbnail" alt="" />
              <span>{{ item.goodsSku.goodsName }}</span>
            </div>
            <div class="width_150">¥{{ item.purchasePrice }}</div>
            <div class="width_100">
              <el-input-number
                v-model="item.num"
                :min="1"
                :max="999"
                @change="changeNum(item.skuId, item.num)"
              />
            </div>
            <div class="width_150">¥{{ (item.purchasePrice * item.num).toFixed(2) }}</div>
            <div class="width_100">
              <el-button type="danger" link @click="deleteItem(item.skuId)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 结算栏 -->
      <div class="cart-footer">
        <div>
          <el-checkbox v-model="allChecked" @change="changeCheckedAll">全选</el-checkbox>
          <el-button type="danger" link @click="clearCart">清空购物车</el-button>
        </div>
        <div class="cart-total">
          <span>已选商品{{ selectedCount }}件</span>
          <span class="total-price">合计：¥{{ totalPrice.toFixed(2) }}</span>
          <el-button type="danger" size="large" @click="goToPay" :disabled="selectedCount === 0">
            去结算
          </el-button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import {
  cartGoodsAll,
  setCheckedAll,
  setCheckedSeller,
  setCheckedGoods,
  setCartGoodsNum,
  delCartGoods,
  clearCart as apiClearCart
} from '@/api/cart'
import { useCartStore } from '@/stores/cart'
import storage from '@/utils/storage'

const router = useRouter()
const cartStore = useCartStore()

const stepIndex = ref<number>(0)
const allChecked = ref<boolean>(false)
const cartList = ref<any[]>([])
const logoImg = ref<string>('')

// 计算属性
const cartNum = computed(() => cartStore.cartNum)

const selectedCount = computed(() => {
  let count = 0
  cartList.value.forEach((shop) => {
    shop.skuList?.forEach((item: any) => {
      if (item.checked) count += item.num
    })
  })
  return count
})

const totalPrice = computed(() => {
  let total = 0
  cartList.value.forEach((shop) => {
    shop.skuList?.forEach((item: any) => {
      if (item.checked) {
        total += item.purchasePrice * item.num
      }
    })
  })
  return total
})

// 获取购物车列表
const getCartList = async () => {
  try {
    const res = await cartGoodsAll()
    const data = res.data || res
    if (data.success && data.result) {
      cartList.value = data.result.cartList || []
      checkAllStatus()
      cartStore.setCartNum(
        cartList.value.reduce((sum, shop) => sum + (shop.skuList?.length || 0), 0)
      )
    }
  } catch (error) {
    console.error('获取购物车列表失败:', error)
  }
}

// 检查全选状态
const checkAllStatus = () => {
  const allItems = cartList.value.flatMap((shop) => shop.skuList || [])
  allChecked.value = allItems.length > 0 && allItems.every((item: any) => item.checked)
}

// 全选/取消全选
const changeCheckedAll = async (checked: boolean) => {
  try {
    await setCheckedAll({ checked: checked ? 1 : 0 })
    cartList.value.forEach((shop) => {
      shop.checked = checked
      shop.skuList?.forEach((item: any) => {
        item.checked = checked
      })
    })
  } catch (error) {
    console.error('设置全选失败:', error)
  }
}

// 店铺全选
const changeCheckedShop = async (checked: boolean, storeId: string) => {
  try {
    await setCheckedSeller({ checked: checked ? 1 : 0, storeId })
    const shop = cartList.value.find((s) => s.storeId === storeId)
    if (shop) {
      shop.skuList?.forEach((item: any) => {
        item.checked = checked
      })
    }
    checkAllStatus()
  } catch (error) {
    console.error('设置店铺全选失败:', error)
  }
}

// 单个商品选择
const changeCheckedItem = async (checked: boolean, skuId: string) => {
  try {
    await setCheckedGoods({ skuId, checked: checked ? 1 : 0 })
    checkAllStatus()
  } catch (error) {
    console.error('设置商品选择失败:', error)
  }
}

// 修改数量
const changeNum = async (skuId: string, num: number) => {
  try {
    await setCartGoodsNum({ skuId, num })
    getCartList()
  } catch (error) {
    console.error('修改数量失败:', error)
  }
}

// 删除商品
const deleteItem = async (skuId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await delCartGoods({ skuIds: [skuId] })
    ElMessage.success('删除成功')
    getCartList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
    }
  }
}

// 清空购物车
const clearCart = async () => {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await apiClearCart()
    ElMessage.success('清空成功')
    getCartList()
    cartStore.clearCart()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
    }
  }
}

// 去结算
const goToPay = () => {
  router.push('/pay')
}

// 去店铺
const goShopPage = (storeId: string) => {
  router.push(`/merchant?id=${storeId}`)
}

onMounted(() => {
  const storedLogo = storage.getItem('logoImg')
  if (storedLogo) {
    logoImg.value = storedLogo
  }
  getCartList()
})
</script>

<style scoped lang="scss">
.cart {
  min-height: 100vh;
  background: #f5f5f5;
}

.width_1200 {
  width: 1200px;
  margin: 0 auto;
}

.logo {
  padding: 20px 0;
  display: flex;
  align-items: center;

  img {
    max-width: 150px;
    cursor: pointer;
  }

  div {
    margin-left: 20px;
    font-size: 16px;
  }
}

.cart-content {
  background: #fff;
  padding: 20px;
  margin-top: 20px;
}

.cart-steps {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;

  span {
    color: #999;

    &.active {
      color: #f31947;
      font-weight: bold;
    }
  }
}

.cart-goods-title {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.width_60 {
  width: 60px;
}

.width_100 {
  width: 100px;
}

.width_150 {
  width: 150px;
}

.goods-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.shop-name {
  padding: 10px 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;

  .go-shop-page {
    color: #f31947;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.cart-goods-items {
  border-bottom: 2px solid #eee;
  margin-bottom: 10px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 2px solid #f31947;
}

.cart-total {
  display: flex;
  align-items: center;
  gap: 20px;

  .total-price {
    font-size: 20px;
    font-weight: bold;
    color: #f31947;
  }
}

.center {
  margin: 0 auto;
}
</style>

