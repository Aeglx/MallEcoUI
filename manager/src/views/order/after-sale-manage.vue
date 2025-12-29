<template>
  <div class="after-sale-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="售后单号">
          <el-input
            v-model="searchForm.serviceSn"
            placeholder="请输入售后单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderSn"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="售后状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="审核通过" value="APPROVED" />
            <el-option label="审核拒绝" value="REJECTED" />
            <el-option label="已完成" value="COMPLETED" />
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
        <el-table-column prop="id" label="售后ID" width="120" />
        <el-table-column prop="serviceSn" label="售后单号" width="180" />
        <el-table-column prop="orderSn" label="订单号" width="180" />
        <el-table-column prop="memberName" label="会员名称" min-width="120" />
        <el-table-column prop="type" label="售后类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'RETURN'" type="warning">退货</el-tag>
            <el-tag v-else-if="row.type === 'REFUND'" type="danger">退款</el-tag>
            <el-tag v-else type="info">换货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="退款金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.amount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'COMPLETED'" type="success">已完成</el-tag>
            <el-tag v-else-if="row.status === 'PENDING'" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === 'APPROVED'" type="primary">审核通过</el-tag>
            <el-tag v-else type="danger">审核拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              link
              type="success"
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              link
              type="danger"
              size="small"
              @click="handleReject(row)"
            >
              拒绝
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
import { getAfterSaleList, reviewAfterSale } from '@/api/after-sale'

const searchForm = reactive({
  serviceSn: '',
  orderSn: '',
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
  searchForm.serviceSn = ''
  searchForm.orderSn = ''
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
    const res = await getAfterSaleList(params)
    const data = res.data || res
    if (data.success) {
      tableData.value = data.result?.records || data.result?.list || data.result || []
      pagination.total = data.result?.total || 0
    }
  } catch (error) {
    console.error('获取售后列表失败:', error)
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
  console.log('查看售后:', row)
}

const handleApprove = (row: any) => {
  ElMessageBox.confirm('确认审核通过？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await reviewAfterSale(row.id.toString(), { status: 'APPROVED' })
      const data = res.data || res
      if (data.success) {
        ElMessage.success('操作成功')
        getData()
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  })
}

const handleReject = (row: any) => {
  ElMessageBox.confirm('确认审核拒绝？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await reviewAfterSale(row.id.toString(), { status: 'REJECTED' })
      const data = res.data || res
      if (data.success) {
        ElMessage.success('操作成功')
        getData()
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.after-sale-page {
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

