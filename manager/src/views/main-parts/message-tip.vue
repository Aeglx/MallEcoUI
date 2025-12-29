<template>
  <div class="message-con">
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ value > 0 ? '有' + value + '条待办事项' : '无待办事项' }}
        <el-icon v-if="value != 0" class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu v-if="value != 0">
          <el-dropdown-item v-if="res.balanceCash" command="deposit">
            <el-badge :value="res.balanceCash" class="item">
              待处理预存款提现申请
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item v-if="res.complain" command="orderComplaint">
            <el-badge :value="res.complain" class="item">
              待处理投诉审核
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item
            v-if="res.distributionCash"
            command="distributionCash"
          >
            <el-badge :value="res.distributionCash" class="item">
              待处理分销商提现申请
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item v-if="res.goods" command="applyGoods">
            <el-badge :value="res.goods" class="item">
              待处理商品审核
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item v-if="res.refund" command="afterSaleOrder">
            <el-badge :value="res.refund" class="item">
              待处理售后申请
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item v-if="res.store" command="shopAuth">
            <el-badge :value="res.store" class="item">
              待处理店铺入驻审核
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item
            v-if="res.waitPayBill"
            command="accountStatementBill"
          >
            <el-badge :value="res.waitPayBill" class="item">
              待与商家对账
            </el-badge>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

const value = ref(0) // 消息数量

const props = defineProps<{
  res: any
}>()

const handleCommand = (command: string) => {
  navigateTo(command)
}

const navigateTo = (name: string) => {
  router.push({
    name
  })
}

onMounted(() => {
  if (props.res) {
    Object.keys(props.res).forEach((item) => {
      value.value = parseInt(String(value.value)) + parseInt(String(props.res[item]))
    })
  }
})
</script>

<style scoped lang="scss">
.message-con {
  margin-right: 10px;
  
  .el-dropdown-link {
    cursor: pointer;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
      color: #409EFF;
    }
  }
}

:deep(.el-dropdown-menu__item) {
  padding: 7px 20px !important;
  text-align: left;
  
  .item {
    display: flex;
    align-items: center;
    width: 100%;
  }
}

:deep(.el-badge__content) {
  margin-left: 8px;
}
</style>

