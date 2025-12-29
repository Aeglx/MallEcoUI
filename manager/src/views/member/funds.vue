<template>
  <div class="funds-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="会员ID">
          <el-input
            v-model="searchForm.memberId"
            placeholder="请输入会员ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="会员名称">
          <el-input
            v-model="searchForm.memberName"
            placeholder="请输入会员名称"
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
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="memberName" label="会员名称" min-width="150" />
        <el-table-column prop="memberId" label="会员ID" width="120" />
        <el-table-column prop="balance" label="余额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.balance || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="frozenAmount" label="冻结金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.frozenAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="availableAmount" label="可用金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.availableAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleRecharge(row)">充值</el-button>
            <el-button link type="primary" size="small" @click="handleView(row)">查看详情</el-button>
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

    <!-- 充值对话框 -->
    <el-dialog v-model="rechargeDialogVisible" title="会员充值" width="500px">
      <el-form ref="rechargeFormRef" :model="rechargeForm" :rules="rechargeFormRules" label-width="100px">
        <el-form-item label="会员名称">
          <el-input v-model="rechargeForm.memberName" disabled />
        </el-form-item>
        <el-form-item label="当前余额">
          <el-input :value="`¥${rechargeForm.currentBalance || '0.00'}`" disabled />
        </el-form-item>
        <el-form-item label="充值金额" prop="amount">
          <el-input-number
            v-model="rechargeForm.amount"
            :min="0.01"
            :precision="2"
            :step="100"
            style="width: 100%"
            placeholder="请输入充值金额"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="rechargeForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rechargeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRechargeSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="会员资金详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="会员ID">{{ detailData.memberId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="会员名称">{{ detailData.memberName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="余额">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.balance || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="冻结金额">
          <span style="color: #e6a23c">¥{{ detailData.frozenAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="可用金额">
          <span style="color: #67c23a">¥{{ detailData.availableAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="累计充值">
          ¥{{ detailData.totalRecharge || '0.00' }}
        </el-descriptions-item>
        <el-descriptions-item label="累计消费">
          ¥{{ detailData.totalConsume || '0.00' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData.updateTime || '-' }}</el-descriptions-item>
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
import { getWalletTransactions, manualRecharge } from '@/api/wallet'

const searchForm = reactive({
  memberId: '',
  memberName: '',
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
  searchForm.memberId = ''
  searchForm.memberName = ''
  handleSearch()
}

const getData = async () => {
  loading.value = true
  try {
    // 这里需要根据实际API调整
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    // const res = await getMemberFundsList(params)
    // if (res.success) {
    //   tableData.value = res.result?.records || res.result?.list || res.result || []
    //   pagination.total = res.result?.total || 0
    // }
  } catch (error) {
    console.error('获取会员资金列表失败:', error)
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

// 充值对话框
const rechargeDialogVisible = ref(false)
const rechargeFormRef = ref()
const rechargeForm = reactive({
  memberId: '',
  memberName: '',
  currentBalance: '0.00',
  amount: 0,
  remark: ''
})

const rechargeFormRules = {
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '充值金额必须大于0', trigger: 'blur' }
  ]
}

const handleRecharge = (row: any) => {
  rechargeForm.memberId = row.memberId || row.id
  rechargeForm.memberName = row.memberName || ''
  rechargeForm.currentBalance = row.balance || '0.00'
  rechargeForm.amount = 0
  rechargeForm.remark = ''
  rechargeDialogVisible.value = true
}

const handleRechargeSubmit = async () => {
  if (!rechargeFormRef.value) return
  await rechargeFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await manualRecharge(rechargeForm.memberId, {
          amount: rechargeForm.amount,
          remark: rechargeForm.remark || '管理员手动充值'
        })
        if (res.success) {
          ElMessage.success('充值成功')
          rechargeDialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '充值失败')
      }
    }
  })
}

// 查看详情对话框
const detailDialogVisible = ref(false)
const detailData = reactive({
  memberId: '',
  memberName: '',
  balance: '0.00',
  frozenAmount: '0.00',
  availableAmount: '0.00',
  totalRecharge: '0.00',
  totalConsume: '0.00',
  updateTime: ''
})

const handleView = async (row: any) => {
  try {
    // 获取详情数据
    const memberId = row.memberId || row.id
    // const res = await getMemberFundsDetail(memberId)
    // if (res.success) {
    //   Object.assign(detailData, res.result)
    //   detailDialogVisible.value = true
    // }
    // 临时使用行数据
    Object.assign(detailData, {
      memberId: row.memberId || row.id,
      memberName: row.memberName || '',
      balance: row.balance || '0.00',
      frozenAmount: row.frozenAmount || '0.00',
      availableAmount: row.availableAmount || '0.00',
      totalRecharge: row.totalRecharge || '0.00',
      totalConsume: row.totalConsume || '0.00',
      updateTime: row.updateTime || ''
    })
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.funds-page {
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

