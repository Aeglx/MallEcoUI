<template>
  <div class="complaint-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="投诉单号">
          <el-input
            v-model="searchForm.complaintSn"
            placeholder="请输入投诉单号"
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
        <el-form-item label="投诉状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待处理" value="PENDING" />
            <el-option label="处理中" value="PROCESSING" />
            <el-option label="已处理" value="COMPLETED" />
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
        <el-table-column prop="id" label="投诉ID" width="120" />
        <el-table-column prop="complaintSn" label="投诉单号" width="180" />
        <el-table-column prop="orderSn" label="订单号" width="180" />
        <el-table-column prop="memberName" label="投诉人" min-width="120" />
        <el-table-column prop="content" label="投诉内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'COMPLETED'" type="success">已处理</el-tag>
            <el-tag v-else-if="row.status === 'PROCESSING'" type="warning">处理中</el-tag>
            <el-tag v-else-if="row.status === 'PENDING'" type="info">待处理</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="投诉时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              link
              type="success"
              size="small"
              @click="handleProcess(row)"
            >
              处理
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
    <el-dialog v-model="viewDialogVisible" title="投诉详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="投诉单号">{{ detailData.complaintSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单号">{{ detailData.orderSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="投诉人">{{ detailData.memberName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'COMPLETED'" type="success">已处理</el-tag>
          <el-tag v-else-if="detailData.status === 'PROCESSING'" type="warning">处理中</el-tag>
          <el-tag v-else-if="detailData.status === 'PENDING'" type="info">待处理</el-tag>
          <el-tag v-else type="danger">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="投诉内容" :span="2">{{ detailData.content || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理结果" :span="2">{{ detailData.handleResult || '-' }}</el-descriptions-item>
        <el-descriptions-item label="投诉时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ detailData.handleTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 处理投诉对话框 -->
    <el-dialog v-model="processDialogVisible" title="处理投诉" width="600px">
      <el-form ref="processFormRef" :model="processForm" :rules="processFormRules" label-width="100px">
        <el-form-item label="投诉单号">
          <el-input v-model="processForm.complaintSn" disabled />
        </el-form-item>
        <el-form-item label="投诉内容">
          <el-input v-model="processForm.content" type="textarea" :rows="4" disabled />
        </el-form-item>
        <el-form-item label="处理结果" prop="handleResult">
          <el-input
            v-model="processForm.handleResult"
            type="textarea"
            :rows="4"
            placeholder="请输入处理结果"
          />
        </el-form-item>
        <el-form-item label="处理状态" prop="status">
          <el-radio-group v-model="processForm.status">
            <el-radio label="PROCESSING">处理中</el-radio>
            <el-radio label="COMPLETED">已处理</el-radio>
            <el-radio label="CLOSED">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProcessSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getComplaintList, getComplaintDetail, handleComplaint } from '@/api/after-sale'

const searchForm = reactive({
  complaintSn: '',
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
  searchForm.complaintSn = ''
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
    const res = await getComplaintList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取投诉列表失败:', error)
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
const viewDialogVisible = ref(false)
const detailData = reactive({
  complaintSn: '',
  orderSn: '',
  memberName: '',
  content: '',
  status: '',
  handleResult: '',
  createTime: '',
  handleTime: ''
})

const handleView = async (row: any) => {
  try {
    const res = await getComplaintDetail(row.id.toString())
    const data = res.data || res
    if (data.success && data.result) {
      Object.assign(detailData, {
        complaintSn: data.result.complaintSn || '',
        orderSn: data.result.orderSn || '',
        memberName: data.result.memberName || '',
        content: data.result.content || '',
        status: data.result.status || '',
        handleResult: data.result.handleResult || '',
        createTime: data.result.createTime || '',
        handleTime: data.result.handleTime || ''
      })
    } else {
      // 如果获取详情失败，使用行数据
      Object.assign(detailData, {
        complaintSn: row.complaintSn || '',
        orderSn: row.orderSn || '',
        memberName: row.memberName || '',
        content: row.content || '',
        status: row.status || '',
        handleResult: row.handleResult || '',
        createTime: row.createTime || '',
        handleTime: row.handleTime || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取投诉详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      complaintSn: row.complaintSn || '',
      orderSn: row.orderSn || '',
      memberName: row.memberName || '',
      content: row.content || '',
      status: row.status || '',
      handleResult: row.handleResult || '',
      createTime: row.createTime || '',
      handleTime: row.handleTime || ''
    })
    viewDialogVisible.value = true
  }
}

// 处理投诉对话框
const processDialogVisible = ref(false)
const processFormRef = ref()
const processForm = reactive({
  id: '',
  complaintSn: '',
  content: '',
  handleResult: '',
  status: 'PROCESSING'
})

const processFormRules = {
  handleResult: [{ required: true, message: '请输入处理结果', trigger: 'blur' }],
  status: [{ required: true, message: '请选择处理状态', trigger: 'change' }]
}

const handleProcess = (row: any) => {
  processForm.id = row.id
  processForm.complaintSn = row.complaintSn || ''
  processForm.content = row.content || ''
  processForm.handleResult = ''
  processForm.status = 'PROCESSING'
  processDialogVisible.value = true
}

const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  await processFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await handleComplaint(processForm.id.toString(), {
          status: processForm.status,
          handleResult: processForm.handleResult
        })
        const data = res.data || res
        if (data.success) {
          ElMessage.success('处理成功')
          processDialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '处理失败')
      }
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.complaint-page {
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

