<template>
  <div class="article-manage-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="文章标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入文章标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" clearable placeholder="请选择分类" style="width: 200px">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>文章管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加文章
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="title" label="文章标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="viewCount" label="浏览量" width="100" align="right" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="文章详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="文章标题" :span="2">{{ detailData.title || '-' }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detailData.categoryName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="浏览量">{{ detailData.viewCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="文章内容" :span="2">
          <div v-html="detailData.content || '-'" style="max-height: 400px; overflow-y: auto"></div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getArticleList, getArticleDetail, getArticleCategoryList } from '@/api/operate'

const searchForm = reactive({
  title: '',
  categoryId: '',
  pageNumber: 1,
  pageSize: 20
})

const categoryOptions = ref([])
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const loadCategoryOptions = async () => {
  try {
    const res = await getArticleCategoryList()
    if (res.success) {
      const buildOptions = (categories: any[]): any[] => {
        const options: any[] = []
        categories.forEach((cat: any) => {
          options.push({ label: cat.name, value: cat.id })
          if (cat.children && cat.children.length > 0) {
            options.push(...buildOptions(cat.children))
          }
        })
        return options
      }
      categoryOptions.value = buildOptions(res.result || [])
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.categoryId = ''
  handleSearch()
}

const getData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res = await getArticleList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  searchForm.pageSize = size
  searchForm.pageNumber = 1
  getData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  searchForm.pageNumber = page
  getData()
}

// 查看详情对话框
const viewDialogVisible = ref(false)
const detailData = reactive({
  title: '',
  categoryName: '',
  viewCount: 0,
  createTime: '',
  updateTime: '',
  content: ''
})

const handleAdd = () => {
  ElMessage.info('文章添加功能较为复杂，建议使用独立的添加页面')
}

const handleView = async (row: any) => {
  try {
    const res = await getArticleDetail(row.id.toString())
    const data = res.data || res
    if (data.success && data.result) {
      Object.assign(detailData, {
        title: data.result.title || '',
        categoryName: data.result.categoryName || '',
        viewCount: data.result.viewCount || 0,
        createTime: data.result.createTime || '',
        updateTime: data.result.updateTime || '',
        content: data.result.content || ''
      })
    } else {
      // 使用行数据
      Object.assign(detailData, {
        title: row.title || '',
        categoryName: row.categoryName || '',
        viewCount: row.viewCount || 0,
        createTime: row.createTime || '',
        updateTime: row.updateTime || '',
        content: row.content || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取文章详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      title: row.title || '',
      categoryName: row.categoryName || '',
      viewCount: row.viewCount || 0,
      createTime: row.createTime || '',
      updateTime: row.updateTime || '',
      content: row.content || ''
    })
    viewDialogVisible.value = true
  }
}

const handleEdit = (row: any) => {
  ElMessage.info('文章编辑功能较为复杂，建议使用独立的编辑页面')
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此文章？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.info('删除功能需要后端提供相应API支持')
    // TODO: 调用删除API
    // deleteArticle(row.id).then(() => {
    //   ElMessage.success('删除成功')
    //   getData()
    // })
  })
}

onMounted(() => {
  loadCategoryOptions()
  getData()
})
</script>

<style scoped lang="scss">
.article-manage-page {
  font-size: 12px;
  .search-card {
    margin-bottom: 16px;
    .search-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pagination-container {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

