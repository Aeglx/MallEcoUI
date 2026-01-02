<template>
  <div class="my-tracks">
    <h2>我的足迹</h2>
    <div class="tracks-list">
      <el-empty v-if="tracksList.length === 0" description="暂无足迹" />
      <div v-else v-for="item in tracksList" :key="item.id" class="track-item">
        <img :src="item.thumbnail" alt="" />
        <div class="track-info">
          <div class="goods-name">{{ item.goodsName }}</div>
          <div class="goods-price">¥{{ item.price }}</div>
          <div class="track-time">{{ item.createTime }}</div>
        </div>
        <el-button @click="viewGoods(item.goodsId, item.id)">查看商品</el-button>
        <el-button type="danger" link @click="deleteTrack(item.id)">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTracks, deleteTrack as apiDeleteTrack } from '@/api/member'

const router = useRouter()

const tracksList = ref<any[]>([])

const getList = async () => {
  try {
    const res = await getTracks({ pageNumber: 1, pageSize: 20 })
    const data = res.data || res
    if (data.success && data.result) {
      tracksList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取足迹失败:', error)
  }
}

const viewGoods = (goodsId: string, trackId: string) => {
  router.push(`/goodsDetail?goodsId=${goodsId}`)
}

const deleteTrack = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这条足迹吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await apiDeleteTrack(id)
    ElMessage.success('删除成功')
    getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.my-tracks {
  padding: 20px;
}

.track-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #eee;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  .track-info {
    flex: 1;
  }

  .goods-name {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .goods-price {
    color: #f31947;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .track-time {
    color: #999;
    font-size: 12px;
  }
}
</style>

