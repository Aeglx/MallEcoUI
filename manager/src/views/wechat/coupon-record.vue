<template>
  <div class="coupon-record-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="卡券名称">
          <el-input
            v-model="searchForm.couponTitle"
            placeholder="请输入卡券名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="核销状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="已核销" value="USED" />
            <el-option label="未核销" value="UNUSED" />
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
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="couponTitle" label="卡券名称" min-width="200" />
        <el-table-column prop="userName" label="用户" min-width="120" />
        <el-table-column prop="code" label="卡券码" width="150" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'USED'" type="success">已核销</el-tag>
            <el-tag v-else type="info">未核销</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="useTime" label="核销时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getWechatCouponRecord } from '@/api/wechat'

const searchForm = reactive({
  couponTitle: '',
  status: '',
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
  searchForm.couponTitle = ''
  searchForm.status = ''
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
    const res = await getWechatCouponRecord(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取核销记录失败:', error)
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

const handleView = (row: any) => {
  console.log('查看记录:', row)
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.coupon-record-page {
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

