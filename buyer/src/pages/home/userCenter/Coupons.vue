<template>
  <div class="coupons">
    <h2>我的优惠券</h2>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="未使用" name="UNUSED"></el-tab-pane>
      <el-tab-pane label="已使用" name="USED"></el-tab-pane>
      <el-tab-pane label="已过期" name="EXPIRE"></el-tab-pane>
    </el-tabs>
    <div class="coupons-list">
      <el-empty v-if="couponsList.length === 0" description="暂无优惠券" />
      <div v-else class="coupon-grid">
        <div v-for="coupon in couponsList" :key="coupon.id" class="coupon-item">
          <div class="coupon-price">
            <span v-if="coupon.couponType === 'PRICE'">¥{{ coupon.price }}</span>
            <span v-else>{{ coupon.discount }}折</span>
          </div>
          <div class="coupon-info">
            <div>满{{ coupon.consumeThreshold }}元可用</div>
            <div>有效期至：{{ coupon.endTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCoupons } from '@/api/member'

const activeTab = ref<string>('UNUSED')
const couponsList = ref<any[]>([])

const handleTabChange = (tab: string) => {
  getList()
}

const getList = async () => {
  try {
    const res = await getCoupons({
      pageNumber: 1,
      pageSize: 20,
      couponStatus: activeTab.value
    })
    const data = res.data || res
    if (data.success && data.result) {
      couponsList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.coupons {
  padding: 20px;
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.coupon-item {
  border: 2px dashed #f31947;
  padding: 20px;
  text-align: center;
  border-radius: 8px;

  .coupon-price {
    font-size: 32px;
    color: #f31947;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .coupon-info {
    color: #666;
    font-size: 14px;
  }
}
</style>

