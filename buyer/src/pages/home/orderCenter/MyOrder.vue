<template>
  <div class="my-order">
    <h2>我的订单</h2>
    <el-tabs v-model="activeStatus" @tab-change="handleStatusChange">
      <el-tab-pane label="全部" name="ALL"></el-tab-pane>
      <el-tab-pane label="待付款" name="UNPAID"></el-tab-pane>
      <el-tab-pane label="待发货" name="UNDELIVERED"></el-tab-pane>
      <el-tab-pane label="待收货" name="DELIVERED"></el-tab-pane>
      <el-tab-pane label="已完成" name="COMPLETE"></el-tab-pane>
      <el-tab-pane label="已取消" name="CANCELLED"></el-tab-pane>
    </el-tabs>
    <div class="order-list">
      <el-empty v-if="orderList.length === 0" description="暂无订单" />
      <div v-else v-for="order in orderList" :key="order.sn" class="order-item">
        <div class="order-header">
          <span>订单号：{{ order.sn }}</span>
          <span>{{ order.createTime }}</span>
        </div>
        <div class="order-goods">
          <div v-for="item in order.orderItems" :key="item.id" class="goods-item">
            <img :src="item.image" alt="" />
            <div class="goods-info">
              <div>{{ item.goodsName }}</div>
              <div>¥{{ item.goodsPrice }} x {{ item.num }}</div>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div>合计：¥{{ order.flowPrice }}</div>
          <div>
            <el-button v-if="order.orderStatus === 'UNPAID'" @click="cancelOrder(order.sn)"
              >取消订单</el-button
            >
            <el-button
              v-if="order.orderStatus === 'DELIVERED'"
              type="primary"
              @click="confirmReceipt(order.sn)"
              >确认收货</el-button
            >
            <el-button @click="viewDetail(order.sn)">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      v-model:current-page="params.pageNumber"
      v-model:page-size="params.pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="getOrderList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderList as apiGetOrderList,
  cancelOrder as apiCancelOrder,
  confirmReceipt as apiConfirmReceipt
} from '@/api/order'

const router = useRouter()

const activeStatus = ref<string>('ALL')
const orderList = ref<any[]>([])
const total = ref<number>(0)

const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  orderStatus: 'ALL'
})

const handleStatusChange = (status: string) => {
  params.orderStatus = status
  params.pageNumber = 1
  getOrderList()
}

const getOrderList = async () => {
  try {
    const res = await apiGetOrderList(params)
    const data = res.data || res
    if (data.success && data.result) {
      orderList.value = data.result.records || []
      total.value = data.result.total || 0
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  }
}

const cancelOrder = async (orderSn: string) => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await apiCancelOrder(orderSn)
    ElMessage.success('取消成功')
    getOrderList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
    }
  }
}

const confirmReceipt = async (orderSn: string) => {
  try {
    await ElMessageBox.confirm('确定已收到商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await apiConfirmReceipt(orderSn)
    ElMessage.success('确认收货成功')
    getOrderList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
    }
  }
}

const viewDetail = (orderSn: string) => {
  router.push(`/home/OrderDetail?sn=${orderSn}`)
}

onMounted(() => {
  getOrderList()
})
</script>

<style scoped lang="scss">
.my-order {
  padding: 20px;
}

.order-list {
  margin-top: 20px;
}

.order-item {
  border: 1px solid #eee;
  margin-bottom: 20px;
  padding: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-goods {
  padding: 15px 0;
}

.goods-item {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .goods-info {
    flex: 1;
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>

