<template>
  <div class="account-safe">
    <h2>账户安全</h2>
    <el-card>
      <div class="safe-item">
        <div>
          <div>登录密码</div>
          <div class="desc">定期更换密码可以让账户更安全</div>
        </div>
        <el-button @click="$router.push('/home/ModifyPwd')">修改</el-button>
      </div>
      <el-divider />
      <div class="safe-item">
        <div>
          <div>手机绑定</div>
          <div class="desc">{{ userInfo?.mobile || '未绑定' }}</div>
        </div>
        <el-button>修改</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
</script>

<style scoped lang="scss">
.account-safe {
  padding: 20px;
}

.safe-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.desc {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>

