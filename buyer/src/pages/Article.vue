<template>
  <div class="article-page">
    <Header />
    <Search />

    <div class="title-bg">
      <p>文章帮助中心</p>
    </div>

    <div class="container width_1200_auto">
      <el-row :gutter="20">
        <!-- 左侧分类 -->
        <el-col :span="6">
          <div class="side-bar">
            <div class="article-cate">文章分类列表</div>
            <el-menu
              class="side-menu"
              :default-active="activeName"
              :default-openeds="openNames"
              @select="onSelect"
            >
              <el-sub-menu
                v-for="(menu, index) in categoryList"
                :key="index"
                :index="menu.articleCategoryName"
              >
                <template #title>
                  <span>{{ menu.articleCategoryName }}</span>
                </template>
                <el-menu-item
                  v-for="(child, i) in menu.children"
                  :key="i"
                  :index="child.id"
                >
                  {{ child.articleCategoryName }}
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="18">
          <div class="content">
            <!-- 文章列表 -->
            <ul class="article-list" v-show="showList">
              <li
                v-for="(article, index) in articleList"
                :key="index"
                @click="getDetail(article.id)"
              >
                {{ article.title }}
              </li>
            </ul>

            <!-- 文章详情 -->
            <div v-show="!showList" class="article-detail">
              <a class="back-btn" @click="showList = true">&lt;返回上一级</a>
              <h2 class="mt_10 mb_10">{{ detail.title }}</h2>
              <div class="mt_10 mb_10" v-html="detail.content"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleCateList, articleDetail, articleList } from '@/api/common'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import Search from '@/components/Search.vue'

const route = useRoute()
const router = useRouter()

const categoryList = ref<any[]>([]) // 分类列表
const detail = ref<any>({}) // 文章详情
const articleList = ref<any[]>([]) // 分类下的文章列表
const activeName = ref<string>('') // 左侧激活项
const openNames = ref<string[]>([]) // 展开的名称
const showList = ref<boolean>(true) // 展示文章列表

const params = ref({
  pageNumber: 1,
  pageSize: 100,
  categoryId: '',
  sort: 'sort'
})

// 选择分类
const onSelect = (id: string) => {
  getList(id)
  detail.value = {}
  showList.value = true
}

// 获取分类列表
const getCateList = async () => {
  try {
    const res = await articleCateList()
    const data = res.data || res
    if (data.success && data.result) {
      categoryList.value = data.result

      // 如果有查询参数id，显示详情
      const articleId = route.query.id as string
      if (articleId) {
        await getDetail(articleId)
      } else {
        // 默认选择第一个分类
        if (categoryList.value.length > 0 && categoryList.value[0].children?.length > 0) {
          activeName.value = categoryList.value[0].children[0].id
          openNames.value = [categoryList.value[0].articleCategoryName]
          getList(activeName.value)
        }
      }
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取文章列表
const getList = async (id: string) => {
  params.value.categoryId = id
  try {
    const res = await articleList(params.value)
    const data = res.data || res
    if (data.success && data.result) {
      articleList.value = data.result.records || []
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

// 获取文章详情
const getDetail = async (id: string) => {
  try {
    const res = await articleDetail(id)
    const data = res.data || res
    if (data.success && data.result) {
      detail.value = data.result
      showList.value = false

      // 设置激活的分类
      if (detail.value.categoryId) {
        activeName.value = detail.value.categoryId
        // 找到对应的父分类
        for (const menu of categoryList.value) {
          if (menu.children) {
            const found = menu.children.find((child: any) => child.id === detail.value.categoryId)
            if (found) {
              openNames.value = [menu.articleCategoryName]
              break
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

onMounted(async () => {
  const articleId = route.query.id as string
  if (articleId) {
    // 先获取详情，再获取分类列表
    await getDetail(articleId)
  }
  await getCateList()
})
</script>

<style lang="scss" scoped>
.article-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.title-bg {
  height: 100px;
  width: 100%;
  background-color: #7b7b7b;

  p {
    width: 1200px;
    font-size: 30px;
    height: 100px;
    line-height: 100px;
    color: #fff;
    margin: 0 auto;
    padding-left: 10px;
  }
}

.container {
  margin: 20px auto;
  padding: 20px 0;
}

.side-bar {
  min-height: 600px;
  background: #fff;
}

.article-cate {
  width: 100%;
  height: 30px;
  color: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background-color: #666;
}

.side-menu {
  border-right: none;
  min-height: 570px;
}

.content {
  padding: 15px 50px;
  min-height: 600px;
  background: #fff;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 10px 0;
    color: #409eff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.article-detail {
  .back-btn {
    color: #409eff;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  :deep(div) {
    line-height: 1.8;
    color: #666;

    p {
      margin: 10px 0;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
}

.mt_10 {
  margin-top: 10px;
}

.mb_10 {
  margin-bottom: 10px;
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}
</style>


