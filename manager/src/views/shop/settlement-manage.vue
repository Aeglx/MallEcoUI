<template>
  <div class="settlement-page">
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
        <el-form-item label="结算状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待结算" value="PENDING" />
            <el-option label="已结算" value="COMPLETED" />
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
        <el-table-column prop="id" label="结算ID" width="120" />
        <el-table-column prop="shopName" label="店铺名称" min-width="200" />
        <el-table-column prop="settlementSn" label="结算单号" width="180" />
        <el-table-column prop="totalAmount" label="结算金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.totalAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="结算状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'COMPLETED'" type="success">已结算</el-tag>
            <el-tag v-else type="warning">待结算</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="结算周期开始" width="160" />
        <el-table-column prop="endDate" label="结算周期结束" width="160" />
        <el-table-column prop="settlementTime" label="结算时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              link
              type="success"
              size="small"
              @click="handleConfirm(row)"
            >
              确认结算
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
import { getShopSettlementList, confirmSettlement } from '@/api/shop'

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
    const res = await getShopSettlementList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取结算列表失败:', error)
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
  console.log('查看结算:', row)
}

const handleConfirm = (row: any) => {
  ElMessageBox.confirm(`确认结算金额：¥${row.totalAmount || '0.00'}`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await confirmSettlement(row.id.toString())
      if (res.success) {
        ElMessage.success('结算成功')
        getData()
      }
    } catch (error) {
      console.error('结算失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.settlement-page {
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

