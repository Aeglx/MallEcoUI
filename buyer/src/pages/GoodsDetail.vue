<template>
  <div style="background: #fff">
    <Header />
    <Search />
    <div class="shop-item-path">
      <div class="shop-nav-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in categoryBar"
            :key="index"
            @click="goGoodsList(index)"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 商品信息展示 -->
    <div v-if="goodsMsg.data && !takeDownSale" class="goods-detail-container">
      <div class="goods-images">
        <el-image
          :src="goodsMsg.data.thumbnail"
          :preview-src-list="[goodsMsg.data.thumbnail]"
          fit="contain"
        />
      </div>
      <div class="goods-info">
        <h1 class="goods-name">{{ goodsMsg.data.goodsName }}</h1>
        <div class="goods-price">
          <span class="current-price">¥{{ goodsMsg.data.price }}</span>
          <span v-if="goodsMsg.data.marketEnablePrice" class="market-price">
            ¥{{ goodsMsg.data.marketEnablePrice }}
          </span>
        </div>
        <div class="goods-specs">
          <div v-if="goodsMsg.data.specList && goodsMsg.data.specList.length > 0">
            <div
              v-for="(spec, index) in goodsMsg.data.specList"
              :key="index"
              class="spec-item"
            >
              <span class="spec-name">{{ spec.specName }}：</span>
              <el-radio-group v-model="selectedSpecs[index]" @change="handleSpecChange">
                <el-radio-button
                  v-for="(value, idx) in spec.specValue"
                  :key="idx"
                  :label="value"
                >
                  {{ value }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="goods-actions">
          <el-input-number v-model="buyNum" :min="1" :max="999" />
          <el-button type="danger" size="large" @click="addToCart">加入购物车</el-button>
          <el-button type="warning" size="large" @click="buyNow">立即购买</el-button>
        </div>
      </div>
    </div>

    <!-- 商品详细信息 -->
    <div v-if="goodsMsg.data && !takeDownSale" class="goods-desc">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div v-html="goodsMsg.data.intro"></div>
        </el-tab-pane>
        <el-tab-pane label="商品评价" name="comment">
          <div>评价功能待开发</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-empty v-if="takeDownSale" description="当前商品已下架">
      <template #description>
        <div>
          <p>当前商品已下架</p>
          <div class="sale-btn">
            <el-button size="small" @click="target('/')">返回首页</el-button>
            <el-button size="small" @click="target('/goodsList')">返回商品列表</el-button>
          </div>
        </div>
      </template>
    </el-empty>

    <el-loading v-loading="isLoading" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import Search from '@/components/Search.vue'
import { goodsSkuDetail } from '@/api/goods'
import { addCartGoods } from '@/api/cart'
import { useCartStore } from '@/stores/cart'
import { useRouter as useVueRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const goodsMsg = reactive<any>({ data: null })
const isLoading = ref<boolean>(false)
const categoryBar = ref<any[]>([])
const takeDownSale = ref<boolean>(false)
const activeTab = ref<string>('detail')
const buyNum = ref<number>(1)
const selectedSpecs = ref<string[]>([])

// 获取商品详情
const getGoodsDetail = async (val?: any) => {
  isLoading.value = true
  try {
    const params = val || route.query
    const res = await goodsSkuDetail({
      goodsId: params.goodsId as string,
      skuId: params.skuId as string
    })
    const data = res.data || res

    if (data.success && data.result) {
      goodsMsg.data = data.result
      categoryBar.value = data.result.categoryBar || []
      selectedSpecs.value = []
    } else {
      takeDownSale.value = true
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    takeDownSale.value = true
  } finally {
    isLoading.value = false
  }
}

// 规格变化
const handleSpecChange = () => {
  // TODO: 根据选择的规格更新商品信息
}

// 加入购物车
const addToCart = async () => {
  if (!goodsMsg.data) return

  try {
    const res = await addCartGoods({
      skuId: goodsMsg.data.id,
      num: buyNum.value
    })
    const data = res.data || res

    if (data.success) {
      ElMessage.success('加入购物车成功')
      cartStore.fetchCartCount()
    } else {
      ElMessage.error(data.message || '加入购物车失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加入购物车失败')
  }
}

// 立即购买
const buyNow = async () => {
  if (!goodsMsg.data) return
  // TODO: 跳转到结算页面
  router.push({
    path: '/cart',
    query: {
      skuId: goodsMsg.data.id,
      num: buyNum.value.toString()
    }
  })
}

// 跳转
const target = (url: string) => {
  router.push(url)
}

const goGoodsList = (index: number) => {
  if (categoryBar.value[index]) {
    router.push({
      path: '/goodsList',
      query: { categoryId: categoryBar.value[index].id }
    })
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  getGoodsDetail()
})
</script>

<style scoped lang="scss">
.shop-item-path {
  background: #f5f5f5;
  padding: 10px 0;
}

.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-detail-container {
  width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
}

.goods-images {
  width: 400px;
  height: 400px;
}

.goods-info {
  flex: 1;
}

.goods-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.goods-price {
  margin-bottom: 20px;
}

.current-price {
  font-size: 32px;
  color: #f31947;
  font-weight: bold;
}

.market-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.goods-specs {
  margin-bottom: 20px;
}

.spec-item {
  margin-bottom: 15px;
}

.spec-name {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

.goods-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.goods-desc {
  width: 1200px;
  margin: 20px auto;
  min-height: 400px;
}

.sale-btn {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>

