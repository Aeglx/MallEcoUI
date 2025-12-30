<template>
  <div class="full-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="活动名称">
          <el-input
            v-model="searchForm.activityName"
            placeholder="请输入活动名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="未开始" value="NEW" />
            <el-option label="进行中" value="START" />
            <el-option label="已结束" value="END" />
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
          <span>满额活动列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加活动
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
        <el-table-column prop="activityName" label="活动名称" min-width="200" />
        <el-table-column prop="fullAmount" label="满额金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.fullAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="minusAmount" label="减额金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.minusAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'START'" type="success">进行中</el-tag>
            <el-tag v-else-if="row.status === 'NEW'" type="info">未开始</el-tag>
            <el-tag v-else type="warning">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="formData.activityName" placeholder="请输入活动名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="满额金额" prop="fullAmount">
          <el-input-number
            v-model="formData.fullAmount"
            :min="0.01"
            :precision="2"
            :step="10"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">元</span>
        </el-form-item>
        <el-form-item label="减额金额" prop="minusAmount">
          <el-input-number
            v-model="formData.minusAmount"
            :min="0.01"
            :precision="2"
            :step="10"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">元</span>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="formData.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 400px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="活动详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称" :span="2">{{ detailData.activityName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="满额金额">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.fullAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="减额金额">
          <span style="color: #67c23a; font-weight: bold">¥{{ detailData.minusAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'START'" type="success">进行中</el-tag>
          <el-tag v-else-if="detailData.status === 'NEW'" type="info">未开始</el-tag>
          <el-tag v-else type="warning">已结束</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ detailData.startTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ detailData.endTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getFullDiscountList,
  getFullDiscountDetail,
  addFullDiscount,
  updateFullDiscount,
  deleteFullDiscount
} from '@/api/promotion'

const searchForm = reactive({
  activityName: '',
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
  searchForm.activityName = ''
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
    const res = await getFullDiscountList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取满额活动列表失败:', error)
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

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加活动')
const formRef = ref()
const formData = reactive({
  id: '',
  activityName: '',
  fullAmount: 0,
  minusAmount: 0,
  dateRange: []
})

const formRules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  fullAmount: [{ required: true, message: '请输入满额金额', trigger: 'blur' }],
  minusAmount: [{ required: true, message: '请输入减额金额', trigger: 'blur' }]
}

// 查看详情对话框
const viewDialogVisible = ref(false)
const detailData = reactive({
  activityName: '',
  fullAmount: '0.00',
  minusAmount: '0.00',
  status: '',
  startTime: '',
  endTime: '',
  createTime: ''
})

const handleAdd = () => {
  dialogTitle.value = '添加活动'
  formData.id = ''
  formData.activityName = ''
  formData.fullAmount = 0
  formData.minusAmount = 0
  formData.dateRange = []
  dialogVisible.value = true
}

const handleView = async (row: any) => {
  try {
    const res = await getFullDiscountDetail(row.id.toString())
    if (res.success && res.result) {
      Object.assign(detailData, {
        activityName: res.result.activityName || '',
        fullAmount: res.result.fullAmount || '0.00',
        minusAmount: res.result.minusAmount || '0.00',
        status: res.result.status || '',
        startTime: res.result.startTime || '',
        endTime: res.result.endTime || '',
        createTime: res.result.createTime || ''
      })
    } else {
      // 使用行数据
      Object.assign(detailData, {
        activityName: row.activityName || '',
        fullAmount: row.fullAmount || '0.00',
        minusAmount: row.minusAmount || '0.00',
        status: row.status || '',
        startTime: row.startTime || '',
        endTime: row.endTime || '',
        createTime: row.createTime || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取活动详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      activityName: row.activityName || '',
      fullAmount: row.fullAmount || '0.00',
      minusAmount: row.minusAmount || '0.00',
      status: row.status || '',
      startTime: row.startTime || '',
      endTime: row.endTime || '',
      createTime: row.createTime || ''
    })
    viewDialogVisible.value = true
  }
}

const handleEdit = async (row: any) => {
  try {
    const res = await getFullDiscountDetail(row.id.toString())
    if (res.success && res.result) {
      dialogTitle.value = '编辑活动'
      formData.id = res.result.id
      formData.activityName = res.result.activityName || ''
      formData.fullAmount = res.result.fullAmount || 0
      formData.minusAmount = res.result.minusAmount || 0
      if (res.result.startTime && res.result.endTime) {
        formData.dateRange = [res.result.startTime, res.result.endTime]
      } else {
        formData.dateRange = []
      }
      dialogVisible.value = true
    }
  } catch (error) {
    // 使用行数据
    dialogTitle.value = '编辑活动'
    formData.id = row.id
    formData.activityName = row.activityName || ''
    formData.fullAmount = row.fullAmount || 0
    formData.minusAmount = row.minusAmount || 0
    if (row.startTime && row.endTime) {
      formData.dateRange = [row.startTime, row.endTime]
    } else {
      formData.dateRange = []
    }
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (!formData.dateRange || formData.dateRange.length !== 2) {
        ElMessage.warning('请选择活动时间')
        return
      }
      if (formData.minusAmount >= formData.fullAmount) {
        ElMessage.warning('减额金额必须小于满额金额')
        return
      }
      try {
        const params: any = {
          activityName: formData.activityName,
          fullAmount: formData.fullAmount,
          minusAmount: formData.minusAmount,
          startTime: formData.dateRange[0],
          endTime: formData.dateRange[1]
        }

        let res
        if (formData.id) {
          res = await updateFullDiscount(formData.id.toString(), params)
        } else {
          res = await addFullDiscount(params)
        }
        if (res.success) {
          ElMessage.success(formData.id ? '修改成功' : '添加成功')
          dialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '操作失败')
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此活动？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteFullDiscount(row.id)
      if (res.success) {
        ElMessage.success('删除成功')
        getData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.full-page {
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

