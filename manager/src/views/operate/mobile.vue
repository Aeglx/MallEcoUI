<template>
  <div class="mobile-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="页面名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入页面名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
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
          <span>移动端楼层装修</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加页面
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
        <el-table-column prop="name" label="页面名称" min-width="200" />
        <el-table-column prop="pageType" label="页面类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.pageType === 'INDEX'" type="primary">首页</el-tag>
            <el-tag v-else type="success">专题</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pageShow" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.pageShow"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleDecorate(row)">装修</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

const searchForm = reactive({
  name: '',
  pageType: 'INDEX',
  pageClientType: 'H5',
  pageNumber: 1,
  pageSize: 20
})

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

const handleReset = () => {
  searchForm.name = ''
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
    // const res = await getPageDecorationList(params)
    // if (res.success) {
    //   tableData.value = res.result?.records || res.result?.list || res.result || []
    //   pagination.total = res.result?.total || 0
    // }
  } catch (error) {
    console.error('获取移动端页面列表失败:', error)
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

const handleAdd = () => {
  console.log('添加页面')
}

const handleEdit = (row: any) => {
  console.log('编辑:', row)
}

const handleDecorate = (row: any) => {
  console.log('装修:', row)
}

const handleStatusChange = (row: any) => {
  console.log('状态变更:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此页面？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // const res = await deletePageDecoration(row.id)
      // if (res.success) {
      //   ElMessage.success('删除成功')
      //   getData()
      // }
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.mobile-page {
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

