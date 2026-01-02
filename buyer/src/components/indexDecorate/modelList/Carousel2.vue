<template>
  <div class="model-carousel2">
    <div class="nav-body clearfix">
      <!-- 侧边导航占位 -->
      <div class="nav-side"></div>
      <div class="nav-content">
        <!-- 左侧轮播图 -->
        <el-carousel :interval="4000" :autoplay="true" height="470px">
          <el-carousel-item v-for="(item, index) in data?.options?.list" :key="index">
            <div style="overflow: hidden">
              <img :src="item.img || item.imageUrl" width="590" height="470" @click="linkTo(item.url || item.linkUrl)" style="cursor: pointer" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="nav-content1">
        <!-- 右侧小图轮播 -->
        <el-carousel :interval="5000" :autoplay="true" height="470px">
          <el-carousel-item v-for="(item, index) in (data?.options?.listRight || [])" :key="index">
            <div class="mb_10" v-if="item[0]">
              <img :src="item[0].img || item[0].imageUrl" width="190" height="150" @click="linkTo(item[0].url || item[0].linkUrl)" style="cursor: pointer" />
            </div>
            <div class="mb_10" v-if="item[1]">
              <img :src="item[1].img || item[1].imageUrl" width="190" height="150" @click="linkTo(item[1].url || item[1].linkUrl)" style="cursor: pointer" />
            </div>
            <div v-if="item[2]">
              <img :src="item[2].img || item[2].imageUrl" width="190" height="150" @click="linkTo(item[2].url || item[2].linkUrl)" style="cursor: pointer" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="nav-right">
        <div class="person-msg">
          <el-avatar
            v-if="userInfo?.face"
            :src="userInfo.face"
            :size="80"
          />
          <el-avatar
            v-else
            :size="80"
            :icon="UserFilled"
          />
          <div class="welcome-text">
            Hi，{{ userInfo?.nickName || userInfo?.username || siteName }}
          </div>
          <el-button
            v-if="userInfo?.id"
            type="danger"
            size="small"
            @click="router.push('/home')"
          >
            会员中心
          </el-button>
          <el-button
            v-else
            type="danger"
            size="small"
            @click="router.push('/login')"
          >
            请登录
          </el-button>
        </div>
        <div class="shop-msg">
          <div class="article-title">常见问题</div>
          <ul class="article-list" v-if="articleList.length > 0">
            <li
              class="ellipsis"
              v-for="(article, index) in articleList"
              :key="index"
              @click="goArticle(article.id)"
            >
              {{ article.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserFilled } from '@element-plus/icons-vue'
import storage from '@/utils/storage'
import { articleList as getArticleList } from '@/api/common'

const props = defineProps<{
  data: any
}>()

const router = useRouter()
const userStore = useUserStore()
const siteName = computed(() => storage.getItem('siteName') || 'MallEco 购物商城')
const userInfo = computed(() => userStore.userInfo)
const articleList = ref<any[]>([])

const linkTo = (url: string) => {
  if (url && typeof url === 'string') {
    if (url.startsWith('/')) {
      router.push(url)
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }
}

const goArticle = (id: string) => {
  const routeUrl = router.resolve({
    path: '/article',
    query: { id }
  })
  window.open(routeUrl.href, '_blank')
}

const getArticles = async () => {
  try {
    const res = await getArticleList({
      pageNumber: 1,
      pageSize: 10,
      type: 'ANNOUNCEMENT',
      sort: 'sort'
    })
    const data = res.data || res
    if (data.success && data.result) {
      articleList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

onMounted(() => {
  if (userStore.isLoggedIn && !userInfo.value) {
    userStore.fetchUserInfo()
  }
  getArticles()
})
</script>

<style lang="scss" scoped>
.model-carousel2 {
  width: 1200px;
  height: 470px;
  overflow: hidden;
  margin: 0 auto;
}

.nav-body {
  width: 1200px;
  height: 470px;
  margin: 0px auto;
}

.nav-side {
  height: 100%;
  width: 200px;
  padding: 0px;
  color: #fff;
  float: left;
  background-color: #6e6568;
  line-height: 470px;
  text-align: center;
}

.nav-content,
.nav-content1 {
  width: 590px;
  height: 470px;
  overflow: hidden;
  float: left;
  position: relative;
  margin-left: 10px;
}

.nav-content1 {
  width: 190px;
}

.mb_10 {
  margin-bottom: 10px;
}

.nav-right {
  float: left;
  width: 190px;
  margin-left: 10px;

  .person-msg {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 20px auto;
    text-align: center;

    .welcome-text {
      margin: 10px 0;
      font-size: 14px;
      color: #333;
    }
  }

  .shop-msg {
    margin: 10px 27px;

    .article-title {
      cursor: pointer;
      text-align: center;
      font-weight: bold;
      color: $theme_color;
      margin-bottom: 10px;
    }

    .article-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        cursor: pointer;
        margin: 5px 0;
        color: #999395;
        width: 150px;
        font-size: 12px;
        line-height: 20px;

        &:hover {
          color: $theme_color;
        }
      }
    }
  }
}

.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

:deep(.el-carousel__item) {
  text-align: center;
}
</style>
