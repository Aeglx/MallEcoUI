<template>
  <div class="order-detail">
    <h2>订单详情</h2>
    <div v-if="orderDetail">
      <el-card>
        <div class="order-header">
          <div>
            <div>订单号：{{ orderDetail.sn }}</div>
            <div>下单时间：{{ orderDetail.createTime }}</div>
          </div>
          <div>
            <el-tag :type="getStatusType(orderDetail.orderStatus)">{{
              getStatusText(orderDetail.orderStatus)
            }}</el-tag>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px">
        <div class="goods-list">
          <div v-for="item in orderDetail.orderItems" :key="item.id" class="goods-item">
            <img :src="item.image" alt="" />
            <div class="goods-info">
              <div>{{ item.goodsName }}</div>
              <div>¥{{ item.goodsPrice }} x {{ item.num }}</div>
            </div>
          </div>
        </div>
        <el-divider />
        <div class="order-summary">
          <div>商品总计：¥{{ orderDetail.goodsPrice }}</div>
          <div>运费：¥{{ orderDetail.freightPrice }}</div>
          <div>实付金额：<span class="total-price">¥{{ orderDetail.flowPrice }}</span></div>
        </div>
      </el-card>
    </div>
    <el-loading v-loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetail } from '@/api/order'

const route = useRoute()

const loading = ref<boolean>(false)
const orderDetail = ref<any>(null)

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    UNPAID: 'warning',
    UNDELIVERED: 'info',
    DELIVERED: 'success',
    COMPLETE: 'success',
    CANCELLED: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    UNPAID: '待付款',
    UNDELIVERED: '待发货',
    DELIVERED: '待收货',
    COMPLETE: '已完成',
    CANCELLED: '已取消'
  }
  return map[status] || status
}

const getDetail = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.query.sn as string)
    const data = res.data || res
    if (data.success && data.result) {
      orderDetail.value = data.result
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped lang="scss">
.order-detail {
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}

.order-summary {
  text-align: right;

  > div {
    margin-bottom: 10px;
  }

  .total-price {
    font-size: 20px;
    font-weight: bold;
    color: #f31947;
  }
}
</style>

