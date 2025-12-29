<template>
  <div class="withdraw-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="会员名称">
          <el-input
            v-model="searchForm.memberName"
            placeholder="请输入会员名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="提现单号">
          <el-input
            v-model="searchForm.withdrawSn"
            placeholder="请输入提现单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="审核通过" value="APPROVED" />
            <el-option label="审核拒绝" value="REJECTED" />
            <el-option label="已打款" value="PAID" />
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
        <el-table-column prop="withdrawSn" label="提现单号" width="180" />
        <el-table-column prop="memberName" label="会员名称" min-width="150" />
        <el-table-column prop="amount" label="提现金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.amount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.fee || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="实际到账" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.actualAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'PAID'" type="success">已打款</el-tag>
            <el-tag v-else-if="row.status === 'APPROVED'" type="primary">审核通过</el-tag>
            <el-tag v-else-if="row.status === 'REJECTED'" type="danger">审核拒绝</el-tag>
            <el-tag v-else type="warning">待审核</el-tag>
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="提现申请详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="提现单号">{{ detailData.withdrawSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="会员名称">{{ detailData.memberName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.amount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="手续费">
          <span style="color: #e6a23c">¥{{ detailData.fee || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="实际到账">
          <span style="color: #67c23a; font-weight: bold">¥{{ detailData.actualAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'PAID'" type="success">已打款</el-tag>
          <el-tag v-else-if="detailData.status === 'APPROVED'" type="primary">审核通过</el-tag>
          <el-tag v-else-if="detailData.status === 'REJECTED'" type="danger">审核拒绝</el-tag>
          <el-tag v-else type="warning">待审核</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="银行卡号">{{ detailData.bankCardNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开户银行">{{ detailData.bankName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开户姓名">{{ detailData.accountName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ detailData.auditTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { withdrawApply } from '@/api/wallet'

const searchForm = reactive({
  memberName: '',
  withdrawSn: '',
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
  searchForm.memberName = ''
  searchForm.withdrawSn = ''
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
    // const res = await getWithdrawList(params)
    // if (res.success) {
    //   tableData.value = res.result?.records || res.result?.list || res.result || []
    //   pagination.total = res.result?.total || 0
    // }
  } catch (error) {
    console.error('获取提现申请失败:', error)
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
const detailDialogVisible = ref(false)
const detailData = reactive({
  withdrawSn: '',
  memberName: '',
  amount: '0.00',
  fee: '0.00',
  actualAmount: '0.00',
  status: '',
  bankCardNo: '',
  bankName: '',
  accountName: '',
  createTime: '',
  auditTime: '',
  remark: ''
})

const handleView = (row: any) => {
  Object.assign(detailData, {
    withdrawSn: row.withdrawSn || '',
    memberName: row.memberName || '',
    amount: row.amount || '0.00',
    fee: row.fee || '0.00',
    actualAmount: row.actualAmount || '0.00',
    status: row.status || '',
    bankCardNo: row.bankCardNo || '',
    bankName: row.bankName || '',
    accountName: row.accountName || '',
    createTime: row.createTime || '',
    auditTime: row.auditTime || '',
    remark: row.remark || ''
  })
  detailDialogVisible.value = true
}

const handleApprove = (row: any) => {
  ElMessageBox.confirm('确认审核通过此提现申请？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // const res = await approveWithdraw(row.id)
      // if (res.success) {
      //   ElMessage.success('审核通过')
      //   getData()
      // }
    } catch (error) {
      console.error('操作失败:', error)
    }
  })
}

const handleReject = (row: any) => {
  ElMessageBox.prompt('请输入拒绝原因', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'textarea'
  }).then(async ({ value }) => {
    try {
      // const res = await rejectWithdraw(row.id, { reason: value })
      // if (res.success) {
      //   ElMessage.success('已拒绝')
      //   getData()
      // }
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
.withdraw-page {
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

