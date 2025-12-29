<template>
  <div class="reconciliation-page">
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
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
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
          <el-button type="success" @click="handleGenerate">
            <el-icon><Plus /></el-icon>
            生成对账单
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
        <el-table-column prop="id" label="对账单ID" width="120" />
        <el-table-column prop="shopName" label="店铺名称" min-width="200" />
        <el-table-column prop="reconciliationSn" label="对账单号" width="180" />
        <el-table-column prop="orderAmount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.orderAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="commissionAmount" label="佣金金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.commissionAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="settlementAmount" label="结算金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.settlementAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="对账周期开始" width="160" />
        <el-table-column prop="endDate" label="对账周期结束" width="160" />
        <el-table-column prop="createTime" label="生成时间" width="160" />
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
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getReconciliationList, generateReconciliation } from '@/api/shop'

const searchForm = reactive({
  shopName: '',
  dateRange: [],
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
  searchForm.dateRange = []
  handleSearch()
}

const getData = async () => {
  loading.value = true
  try {
    const params: any = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    delete params.dateRange
    const res = await getReconciliationList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取对账列表失败:', error)
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
  console.log('查看对账单:', row)
}

const handleGenerate = async () => {
  try {
    const params: any = {}
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    if (searchForm.shopName) {
      params.shopName = searchForm.shopName
    }
    const res = await generateReconciliation(params)
    if (res.success) {
      ElMessage.success('生成成功')
      getData()
    }
  } catch (error) {
    console.error('生成失败:', error)
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.reconciliation-page {
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

