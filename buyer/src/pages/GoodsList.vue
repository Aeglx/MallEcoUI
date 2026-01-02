<template>
  <div class="wrapper">
    <Header />
    <Search @search="handleSearch" />
    <div class="container">
      <div class="goods-box">
        <div class="goods-list-box">
          <!-- 排序 -->
          <div class="goods-list-tool">
            <ul>
              <li
                v-for="(item, index) in goodsTool"
                :key="index"
                @click="orderBy(item.en, index)"
              >
                <span :class="{ 'goods-list-tool-active': index === sortIndex }">
                  {{ item.title }}
                </span>
              </li>
              <li @click="orderBy('price', 5)" class="price-sort">
                <span :class="{ 'goods-list-tool-active': 5 === sortIndex }">
                  价格
                  <div>
                    <el-icon><ArrowUp /></el-icon>
                    <el-icon><ArrowDown /></el-icon>
                  </div>
                </span>
              </li>
            </ul>
          </div>
          <!-- 列表 -->
          <div class="goods-list">
            <el-empty v-if="goodsList.length === 0" description="暂无商品" />
            <div
              v-else
              class="goods-show-info"
              v-for="(item, index) in goodsList"
              :key="index"
              @click="goGoodsDetail(item.id, item.goodsId)"
            >
              <div class="goods-show-img">
                <img width="220" height="220" :src="item.thumbnail" alt="" />
              </div>
              <div class="goods-show-price">
                <span class="seckill-price text-danger">¥{{ item.price }}</span>
              </div>
              <div class="goods-show-detail">
                <el-tag v-if="item.salesModel === 'WHOLESALE'" type="warning" size="small">
                  批发
                </el-tag>
                <span>{{ item.goodsName }}</span>
              </div>
              <div class="goods-show-num">
                已有<span>{{ item.commentNum || 0 }}</span>人评价
              </div>
              <div class="goods-show-seller">
                <span style="color: #e4393c">{{ item.storeName }}</span>
              </div>
              <div class="goods-show-right">
                <el-tag v-if="item.selfOperated" type="danger" size="small">自营</el-tag>
                <el-tag v-if="item.goodsType === 'VIRTUAL_GOODS'" type="info" size="small">
                  虚拟
                </el-tag>
                <el-tag v-else-if="item.goodsType === 'PHYSICAL_GOODS'" type="info" size="small">
                  实物
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-page">
        <el-pagination
          v-model:current-page="params.pageNumber"
          v-model:page-size="params.pageSize"
          :total="total"
          :page-sizes="[20, 40, 60, 80]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="changePageNum"
          @size-change="changePageSize"
        />
      </div>
    </div>
    <el-loading v-loading="loading" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import Search from '@/components/Search.vue'
import { goodsList } from '@/api/goods'

const router = useRouter()
const route = useRoute()

const sortIndex = ref<number>(0)
const sortPriceIndex = ref<string | boolean>(false)
const loading = ref<boolean>(false)
const total = ref<number>(0)
const goodsList = ref<any[]>([])

const goodsTool = [
  { title: '综合', en: '' },
  { title: '销量', en: 'buyCount' },
  { title: '评论数', en: 'commentNum' },
  { title: '新品', en: 'releaseTime' }
]

const params = reactive({
  pageNumber: 1,
  pageSize: 20,
  categoryId: '',
  keyword: '',
  sort: '',
  order: 'desc'
})

// 搜索
const handleSearch = (keyword: string) => {
  params.keyword = keyword
  params.pageNumber = 1
  getGoodsList()
}

// 排序
const orderBy = (data: string, index: number) => {
  sortIndex.value = index
  params.sort = data
  params.order = 'desc'

  if (data === 'price') {
    if (!sortPriceIndex.value) {
      sortPriceIndex.value = 'asc'
    } else {
      sortPriceIndex.value =
        sortPriceIndex.value === 'desc' ? 'asc' : 'desc'
    }
    params.order = sortPriceIndex.value as string
  } else {
    sortPriceIndex.value = false
  }
  getGoodsList()
}

// 跳转商品详情
const goGoodsDetail = (skuId: string, goodsId: string) => {
  const routeUrl = router.resolve({
    path: '/goodsDetail',
    query: { skuId, goodsId }
  })
  window.open(routeUrl.href, '_blank')
}

// 分页
const changePageNum = (val: number) => {
  params.pageNumber = val
  getGoodsList()
  window.scrollTo(0, 0)
}

const changePageSize = (val: number) => {
  params.pageNumber = 1
  params.pageSize = val
  getGoodsList()
}

// 获取商品列表
const getGoodsList = async () => {
  loading.value = true
  try {
    const res = await goodsList(params)
    const data = res.data || res
    if (data.success && data.result) {
      goodsList.value = data.result.records || []
      total.value = data.result.total || 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.categoryId) {
      const cateId = String(newQuery.categoryId).split(',')
      params.categoryId = cateId[cateId.length - 1]
    }
    if (newQuery.keyword) {
      params.keyword = newQuery.keyword as string
    }
    if (newQuery.promotionType) {
      ;(params as any).promotionType = newQuery.promotionType
    }
    if (newQuery.promotionsId) {
      ;(params as any).promotionsId = newQuery.promotionsId
    }
    getGoodsList()
  },
  { immediate: true }
)

onMounted(() => {
  window.scrollTo(0, 0)
  if (route.query.categoryId) {
    const cateId = String(route.query.categoryId).split(',')
    params.categoryId = cateId[cateId.length - 1]
  }
  if (route.query.keyword) {
    params.keyword = route.query.keyword as string
  }
  Object.assign(params, route.query)
  getGoodsList()
})
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 100vh;
}

.container {
  margin: 25px auto 15px auto;
  width: 1184px;
  min-width: 1000px;
  position: relative;
}

.goods-box {
  display: flex;
}

.goods-list-box {
  position: relative;
  width: 100%;
}

.goods-list-tool {
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;

  ul {
    padding-left: 15px;
    font-size: 12px;
    margin-top: 10px;
    list-style: none;
    display: flex;
    align-items: center;

    li {
      cursor: pointer;
      float: left;

      span {
        padding: 3px 5px;
        border: 1px solid #ccc;
        margin-left: -1px;
        background-color: #fff;
        display: inline-block;
        cursor: pointer;

        &:hover {
          border-color: #f31947;
          position: relative;
          z-index: 1;
        }

        &.goods-list-tool-active {
          color: #fff;
          background-color: #f31947 !important;
        }
      }
    }
  }
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.goods-show-info {
  width: 220px;
  padding: 10px;
  margin: 5px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #f31947;
    box-shadow: 0 0 10px rgba(243, 25, 71, 0.1);
  }
}

.goods-show-img {
  width: 220px;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.goods-show-price {
  margin: 10px 0;
  font-size: 18px;
  font-weight: bold;
  color: #f31947;
}

.goods-show-detail {
  font-size: 14px;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-show-num {
  font-size: 12px;
  color: #999;
  margin: 5px 0;
}

.goods-show-seller {
  font-size: 12px;
  margin: 5px 0;
}

.goods-show-right {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.goods-page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.price-sort {
  span {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.text-danger {
  color: #f31947;
}
</style>

