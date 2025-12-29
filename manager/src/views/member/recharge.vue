<template>
  <div class="recharge-page">
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
        <el-form-item label="充值单号">
          <el-input
            v-model="searchForm.rechargeSn"
            placeholder="请输入充值单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待支付" value="PENDING" />
            <el-option label="已支付" value="PAID" />
            <el-option label="已取消" value="CANCELLED" />
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
      <template #header>
        <div class="card-header">
          <span>充值记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            手动充值
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
        <el-table-column prop="rechargeSn" label="充值单号" width="180" />
        <el-table-column prop="memberName" label="会员名称" min-width="150" />
        <el-table-column prop="amount" label="充值金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.amount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'PAID'" type="success">已支付</el-tag>
            <el-tag v-else-if="row.status === 'PENDING'" type="warning">待支付</el-tag>
            <el-tag v-else type="danger">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="payTime" label="支付时间" width="160" />
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

    <!-- 手动充值对话框 -->
    <el-dialog v-model="rechargeDialogVisible" title="手动充值" width="500px">
      <el-form ref="rechargeFormRef" :model="rechargeForm" :rules="rechargeFormRules" label-width="100px">
        <el-form-item label="会员ID" prop="memberId">
          <el-input v-model="rechargeForm.memberId" placeholder="请输入会员ID" />
        </el-form-item>
        <el-form-item label="会员名称">
          <el-input v-model="rechargeForm.memberName" placeholder="请输入会员名称（可选）" />
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
        <el-form-item label="备注">
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
    <el-dialog v-model="detailDialogVisible" title="充值记录详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="充值单号">{{ detailData.rechargeSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="会员名称">{{ detailData.memberName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="充值金额">
          <span style="color: #67c23a; font-weight: bold">¥{{ detailData.amount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'PAID'" type="success">已支付</el-tag>
          <el-tag v-else-if="detailData.status === 'PENDING'" type="warning">待支付</el-tag>
          <el-tag v-else type="danger">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ detailData.payType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detailData.payTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { manualRecharge } from '@/api/wallet'

const searchForm = reactive({
  memberName: '',
  rechargeSn: '',
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
  searchForm.rechargeSn = ''
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
    // const res = await getRechargeList(params)
    // if (res.success) {
    //   tableData.value = res.result?.records || res.result?.list || res.result || []
    //   pagination.total = res.result?.total || 0
    // }
  } catch (error) {
    console.error('获取充值记录失败:', error)
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

// 手动充值对话框
const rechargeDialogVisible = ref(false)
const rechargeFormRef = ref()
const rechargeForm = reactive({
  memberId: '',
  memberName: '',
  amount: 0,
  remark: ''
})

const rechargeFormRules = {
  memberId: [{ required: true, message: '请输入会员ID', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '充值金额必须大于0', trigger: 'blur' }
  ]
}

const handleAdd = () => {
  rechargeForm.memberId = ''
  rechargeForm.memberName = ''
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
  rechargeSn: '',
  memberName: '',
  amount: '0.00',
  status: '',
  payType: '',
  payTime: '',
  remark: '',
  createTime: ''
})

const handleView = (row: any) => {
  Object.assign(detailData, {
    rechargeSn: row.rechargeSn || '',
    memberName: row.memberName || '',
    amount: row.amount || '0.00',
    status: row.status || '',
    payType: row.payType || '',
    payTime: row.payTime || '',
    remark: row.remark || '',
    createTime: row.createTime || ''
  })
  detailDialogVisible.value = true
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.recharge-page {
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

