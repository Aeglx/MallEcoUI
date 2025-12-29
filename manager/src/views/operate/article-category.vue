<template>
  <div class="article-category-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>文章分类</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="sortOrder" label="排序值" width="100" align="center" />
        <el-table-column prop="articleCount" label="文章数量" width="100" align="right" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getArticleCategoryList } from '@/api/operate'

const loading = ref(false)
const tableData = ref([])

const getData = async () => {
  loading.value = true
  try {
    const res = await getArticleCategoryList()
    if (res.success) {
      tableData.value = res.result || []
    }
  } catch (error) {
    console.error('获取文章分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  console.log('添加分类')
}

const handleEdit = (row: any) => {
  console.log('编辑分类:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此分类？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getData()
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.article-category-page {
  font-size: 12px;
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

