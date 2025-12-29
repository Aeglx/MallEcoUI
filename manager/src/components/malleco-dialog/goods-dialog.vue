<template>
  <div class="wrapper">
    <div class="wap-content">
      <div class="query-wrapper">
        <div class="query-item">
          <div>搜索范围</div>
          <el-input
            placeholder="商品名称"
            @clear="handleClear"
            @keyup.enter="handleSearch"
            clearable
            style="width: 150px"
            v-model="goodsParams.goodsName"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="query-item">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
      </div>
      <div>
        <div class="wap-content-list">
          <div
            class="wap-content-item"
            :class="{ active: item.selected }"
            @click="checkedGoods(item, index)"
            v-for="(item, index) in goodsData"
            :key="index"
          >
            <div>
              <img :src="item.thumbnail" alt="" />
            </div>
            <div class="wap-content-desc">
              <div class="wap-content-desc-title">{{ item.goodsName }}</div>
              <div class="wap-sku">
                {{ item.goodsUnit }}
                <el-tag
                  style="margin-left: 10px"
                  :type="item.salesModel === 'RETAIL' ? 'info' : 'primary'"
                >
                  {{ item.salesModel === 'RETAIL' ? '零售型' : '批发型' }}
                </el-tag>
              </div>
              <div class="wap-content-desc-bottom">
                <div>￥{{ formatPrice(item.price) }}</div>
              </div>
            </div>
          </div>
          <div v-loading="loading" style="min-height: 300px">
            <div v-if="empty" class="empty">暂无商品信息</div>
          </div>
        </div>
        <el-pagination
          :total="total"
          class="pageration"
          @current-change="changePageSize"
          :page-size="goodsParams.pageSize"
          small
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getGoodsList } from '@/api/goods'
import type { ApiResponse } from '@/types/api'

const props = defineProps<{
  type?: string // single 或 multiple
  selectedWay?: any[]
}>()

const emit = defineEmits<{
  selected: [data: any[]]
}>()

const type = ref(props.type || 'multiple')
const total = ref(0)
const loading = ref(false)
const empty = ref(false)

const goodsParams = ref({
  goodsName: '',
  pageNumber: 1,
  pageSize: 20
})

const goodsData = ref<any[]>([])

const formatPrice = (price: number) => {
  return String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleClear = () => {
  goodsData.value = []
  goodsParams.value.goodsName = ''
  goodsParams.value.pageNumber = 1
  getQueryGoodsList()
}

const handleSearch = () => {
  goodsData.value = []
  goodsParams.value.pageNumber = 1
  getQueryGoodsList()
}

const getQueryGoodsList = async () => {
  loading.value = true
  try {
    const res = (await getGoodsList(goodsParams.value)) as unknown as ApiResponse<any>
    if (res.success) {
      const list = res.result?.records || []
      goodsData.value = list.map((item: any) => ({
        ...item,
        selected: false
      }))
      total.value = res.result?.total || 0
      empty.value = goodsData.value.length === 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const checkedGoods = (item: any, index: number) => {
  if (type.value === 'single') {
    goodsData.value.forEach((g) => (g.selected = false))
    item.selected = true
    emit('selected', [item])
  } else {
    item.selected = !item.selected
    const selected = goodsData.value.filter((g) => g.selected)
    emit('selected', selected)
  }
}

const changePageSize = (page: number) => {
  goodsParams.value.pageNumber = page
  getQueryGoodsList()
}

watch(
  () => props.selectedWay,
  (val) => {
    if (val && val.length > 0) {
      goodsData.value.forEach((item) => {
        item.selected = val.some((v: any) => v.id === item.id)
      })
    }
  },
  { immediate: true }
)

// 初始化加载
getQueryGoodsList()
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px;
}

.query-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.query-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wap-content-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  min-height: 300px;
  position: relative;
}

.wap-content-item {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border-color: #2d8cf0;
    box-shadow: 0 0 5px rgba(45, 140, 240, 0.3);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
}

.wap-content-desc {
  margin-top: 10px;

  &-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-bottom {
    margin-top: 5px;
    color: #ff5c58;
    font-size: 16px;
    font-weight: 500;
  }
}

.empty {
  text-align: center;
  padding: 50px;
  color: #999;
}

.pageration {
  margin-top: 20px;
  text-align: right;
}
</style>

