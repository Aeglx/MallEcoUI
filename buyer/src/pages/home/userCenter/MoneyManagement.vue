<template>
  <div class="money-management">
    <h2>资金管理</h2>
    <el-card>
      <div class="balance-info">
        <div class="balance-item">
          <div class="label">账户余额</div>
          <div class="value">¥{{ balance }}</div>
        </div>
        <div class="balance-item">
          <div class="label">冻结金额</div>
          <div class="value">¥{{ frozenAmount }}</div>
        </div>
      </div>
      <el-divider />
      <div class="actions">
        <el-button type="primary">充值</el-button>
        <el-button>提现</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMemberInfo } from '@/api/member'

const balance = ref<number>(0)
const frozenAmount = ref<number>(0)

const getInfo = async () => {
  try {
    const res = await getMemberInfo()
    const data = res.data || res
    if (data.success && data.result) {
      balance.value = data.result.memberWallet?.memberBalance || 0
      frozenAmount.value = data.result.memberWallet?.memberFrozenWallet || 0
    }
  } catch (error) {
    console.error('获取资金信息失败:', error)
  }
}

onMounted(() => {
  getInfo()
})
</script>

<style scoped lang="scss">
.money-management {
  padding: 20px;
}

.balance-info {
  display: flex;
  gap: 50px;
}

.balance-item {
  .label {
    color: #999;
    margin-bottom: 10px;
  }

  .value {
    font-size: 24px;
    font-weight: bold;
    color: #f31947;
  }
}

.actions {
  margin-top: 20px;
}
</style>

