<template>
  <div class="favorites">
    <h2>我的收藏</h2>
    <div class="favorites-list">
      <el-empty v-if="favoritesList.length === 0" description="暂无收藏" />
      <div v-else class="goods-grid">
        <div v-for="item in favoritesList" :key="item.id" class="goods-item">
          <img :src="item.thumbnail" alt="" @click="viewGoods(item.goodsId)" />
          <div class="goods-info">
            <div class="goods-name" @click="viewGoods(item.goodsId)">{{ item.goodsName }}</div>
            <div class="goods-price">¥{{ item.price }}</div>
          </div>
          <el-button type="danger" size="small" @click="removeFavorite(item.goodsId)">取消收藏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFavorites, removeFavorite as apiRemoveFavorite } from '@/api/member'

const router = useRouter()

const favoritesList = ref<any[]>([])

const getList = async () => {
  try {
    const res = await getFavorites({ pageNumber: 1, pageSize: 20 })
    const data = res.data || res
    if (data.success && data.result) {
      favoritesList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
  }
}

const viewGoods = (goodsId: string) => {
  router.push(`/goodsDetail?goodsId=${goodsId}`)
}

const removeFavorite = async (goodsId: string) => {
  try {
    await ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await apiRemoveFavorite(goodsId)
    ElMessage.success('取消收藏成功')
    getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.favorites {
  padding: 20px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goods-item {
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;

  &:hover {
    border-color: #f31947;
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .goods-name {
    font-size: 14px;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
      color: #f31947;
    }
  }

  .goods-price {
    color: #f31947;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>

