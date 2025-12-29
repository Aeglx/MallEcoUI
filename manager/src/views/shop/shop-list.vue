<template>
  <div class="shop-list-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="店铺名称">
          <el-input
            v-model="searchForm.shopName"
            placeholder="请输入店铺名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="店铺状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="营业中" value="OPEN" />
            <el-option label="已关闭" value="CLOSED" />
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
        <el-table-column prop="id" label="店铺ID" width="120" />
        <el-table-column prop="shopName" label="店铺名称" min-width="200" />
        <el-table-column prop="ownerName" label="店主" min-width="120" />
        <el-table-column prop="mobile" label="联系方式" width="150" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'OPEN'" type="success">营业中</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 'OPEN' ? 'danger' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'OPEN' ? '关闭' : '开启' }}
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
import { getShopList, updateShopStatus } from '@/api/shop'

const searchForm = reactive({
  shopName: '',
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
  searchForm.shopName = ''
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
    const res = await getShopList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
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
  console.log('查看店铺:', row)
}

const handleEdit = (row: any) => {
  console.log('编辑店铺:', row)
}

const handleToggleStatus = (row: any) => {
  const action = row.status === 'OPEN' ? '关闭' : '开启'
  ElMessageBox.confirm(`确认${action}此店铺？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateShopStatus(row.id, {
        status: row.status === 'OPEN' ? 'CLOSED' : 'OPEN'
      })
      if (res.success) {
        ElMessage.success(`${action}成功`)
        getData()
      }
    } catch (error) {
      console.error(`${action}失败:`, error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.shop-list-page {
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

