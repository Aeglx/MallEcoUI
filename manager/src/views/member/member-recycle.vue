<template>
  <div class="member-recycle-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="会员名称">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入会员名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="searchForm.mobile"
            placeholder="请输入联系方式"
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
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="id" label="会员ID" width="120" />
        <el-table-column prop="username" label="会员名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="mobile" label="联系方式" width="130" />
        <el-table-column prop="nickName" label="会员昵称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="deleteTime" label="删除时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleRestore(row)">恢复</el-button>
            <el-button link type="danger" size="small" @click="handlePermanentDelete(row)">
              永久删除
            </el-button>
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getRecycleMember, restoreMember, permanentDeleteMember } from '@/api/member'

// 搜索表单
const searchForm = reactive({
  username: '',
  mobile: '',
  pageNumber: 1,
  pageSize: 20
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 搜索
const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.mobile = ''
  handleSearch()
}

// 获取数据
const getData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res = await getRecycleMember(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取回收站列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  searchForm.pageSize = size
  searchForm.pageNumber = 1
  getData()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.page = page
  searchForm.pageNumber = page
  getData()
}

// 恢复会员
const handleRestore = (row: any) => {
  ElMessageBox.confirm('确认恢复此会员？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await restoreMember(row.id)
      if (res.success) {
        ElMessage.success('恢复成功')
        getData()
      }
    } catch (error) {
      console.error('恢复会员失败:', error)
    }
  })
}

// 永久删除
const handlePermanentDelete = (row: any) => {
  ElMessageBox.confirm('确认永久删除此会员？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(async () => {
    try {
      const res = await permanentDeleteMember(row.id)
      if (res.success) {
        ElMessage.success('删除成功')
        getData()
      }
    } catch (error) {
      console.error('删除会员失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.member-recycle-page {
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
    .pagination-container {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

