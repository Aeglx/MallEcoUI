<template>
  <div class="navbar">
    <div class="container width_1200_auto flex flex-a-c">
      <img
        :src="logoImg"
        v-if="showLogo"
        class="logo-img"
        alt=""
        @click="$router.push('/')"
      />
      <div class="search-box">
        <el-input
          v-model="searchData"
          size="large"
          class="search"
          placeholder="输入你想查找的商品"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch" :icon="SearchIcon" />
          </template>
        </el-input>
        <template v-if="showTag && promotionTags.length > 0">
          <div class="history-list flex">
            <div v-for="(item, index) in promotionTags" :key="index" class="mr_10">
              <span class="history-item" @click="selectTags(item)">{{ item }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import storage from '@/utils/storage'

const props = withDefaults(
  defineProps<{
    showTag?: boolean
    showLogo?: boolean
    storeId?: string
  }>(),
  {
    showTag: true,
    showLogo: true,
    storeId: ''
  }
)

const emit = defineEmits<{
  (e: 'search', keyword: string): void
}>()

const router = useRouter()
const route = useRoute()

const searchData = ref<string>('')
const logoImg = ref<string>('')
const promotionTags = ref<string[]>([])

// 监听storage变化，以便及时更新logo
const updateLogo = () => {
  const storedLogo = storage.getItem('logoImg')
  if (storedLogo) {
    logoImg.value = storedLogo
  }
}

const handleSearch = () => {
  const url = route.path
  if (url === '/goodsList') {
    emit('search', searchData.value)
  } else {
    router.push({
      path: '/goodsList',
      query: { keyword: searchData.value }
    })
  }
}

const selectTags = (item: string) => {
  searchData.value = item
  handleSearch()
}

watch(
  () => route.query.keyword,
  (val) => {
    if (val) {
      searchData.value = val as string
    }
  },
  { immediate: true }
)

// 监听storage变化
watch(
  () => storage.getItem('logoImg'),
  () => {
    updateLogo()
  }
)

onMounted(() => {
  updateLogo()
  
  // 延迟一下再获取，确保App.vue已经获取到
  setTimeout(() => {
    updateLogo()
  }, 100)

  // 加载热词
  const storedTags = storage.getItem('hotWordsList')
  if (storedTags) {
    try {
      promotionTags.value = JSON.parse(storedTags)
    } catch (e) {
      console.error('解析热词失败:', e)
    }
  }
})
</script>

<style scoped lang="scss">
.navbar {
  height: 113px;
  background: #fff;
}

.container {
  position: relative;
  height: 100%;
}

.flex {
  display: flex;
}

.flex-a-c {
  align-items: center;
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}

.search-box {
  margin-left: 28px;
}

.search {
  width: 778px;
  margin: 10px 0 5px 0;
}

.logo-img {
  max-width: 150px;
  cursor: pointer;
}

.history-list {
  margin-left: 28px;
}

.history-item {
  font-size: 13px;
  line-height: 16px;
  margin-right: 17px;
  color: #666666;
  cursor: pointer;

  &:hover {
    color: #f31947;
  }
}

.mr_10 {
  margin-right: 10px;
}
</style>

