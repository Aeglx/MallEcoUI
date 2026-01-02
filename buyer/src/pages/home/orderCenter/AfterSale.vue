<template>
  <div class="after-sale">
    <h2>售后订单</h2>
    <div class="after-sale-list">
      <el-empty v-if="afterSaleList.length === 0" description="暂无售后订单" />
      <div v-else v-for="item in afterSaleList" :key="item.sn" class="after-sale-item">
        <div class="item-header">
          <span>售后单号：{{ item.sn }}</span>
          <el-tag :type="getStatusType(item.serviceStatus)">{{ getStatusText(item.serviceStatus) }}</el-tag>
        </div>
        <div class="item-content">
          <img :src="item.goodsImage" alt="" />
          <div class="item-info">
            <div>{{ item.goodsName }}</div>
            <div>退款金额：¥{{ item.refundPrice }}</div>
          </div>
        </div>
        <div class="item-actions">
          <el-button @click="viewDetail(item.sn)">查看详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAfterSaleList } from '@/api/order'

const router = useRouter()

const afterSaleList = ref<any[]>([])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    APPLY: 'warning',
    PASS: 'success',
    REFUSE: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    APPLY: '申请中',
    PASS: '已通过',
    REFUSE: '已拒绝'
  }
  return map[status] || status
}

const getList = async () => {
  try {
    const res = await getAfterSaleList({ pageNumber: 1, pageSize: 10 })
    const data = res.data || res
    if (data.success && data.result) {
      afterSaleList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取售后列表失败:', error)
  }
}

const viewDetail = (sn: string) => {
  router.push(`/home/AfterSaleDetail?sn=${sn}`)
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.after-sale {
  padding: 20px;
}

.after-sale-item {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.item-content {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}

.item-actions {
  text-align: right;
}
</style>

