<template>
  <div class="member-review-page">
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
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.goodsName"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="评价状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
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
        <el-table-column prop="id" label="评价ID" width="120" />
        <el-table-column prop="memberName" label="会员名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="goodsName" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="grade" label="评分" width="100" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.grade" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="250" show-overflow-tooltip />
        <el-table-column prop="images" label="评价图片" width="120">
          <template #default="{ row }">
            <div v-if="row.images && row.images.length > 0" class="image-list">
              <el-image
                v-for="(img, index) in row.images.slice(0, 3)"
                :key="index"
                :src="img"
                :preview-src-list="row.images"
                fit="cover"
                style="width: 30px; height: 30px; margin-right: 5px"
              />
            </div>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'APPROVED'" type="success">已通过</el-tag>
            <el-tag v-else-if="row.status === 'REJECTED'" type="danger">已拒绝</el-tag>
            <el-tag v-else type="warning">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="评价详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="评价ID">{{ viewData.id }}</el-descriptions-item>
        <el-descriptions-item label="会员名称">{{ viewData.memberName }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ viewData.goodsName }}</el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate v-model="viewData.grade" disabled show-score text-color="#ff9900" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="viewData.status === 'APPROVED'" type="success">已通过</el-tag>
          <el-tag v-else-if="viewData.status === 'REJECTED'" type="danger">已拒绝</el-tag>
          <el-tag v-else type="warning">待审核</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评价内容" :span="2">{{ viewData.content }}</el-descriptions-item>
        <el-descriptions-item label="评价图片" :span="2" v-if="viewData.images && viewData.images.length > 0">
          <div class="image-list">
            <el-image
              v-for="(img, index) in viewData.images"
              :key="index"
              :src="img"
              :preview-src-list="viewData.images"
              fit="cover"
              style="width: 100px; height: 100px; margin-right: 10px"
            />
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="评价时间">{{ viewData.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getMemberReview,
  getEvaluationDetail,
  updateEvaluationStatus,
  deleteEvaluation
} from '@/api/member'

// 搜索表单
const searchForm = reactive({
  memberName: '',
  goodsName: '',
  status: '',
  pageNumber: 1,
  pageSize: 20
})

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 查看对话框
const viewDialogVisible = ref(false)
const viewData = ref({})

// 搜索
const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.memberName = ''
  searchForm.goodsName = ''
  searchForm.status = ''
  handleSearch()
}

// 获取数据
const getData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res = await getMemberReview(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取评价列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  searchForm.pageSize = size
  searchForm.pageNumber = 1
  getData()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.page = page
  searchForm.pageNumber = page
  getData()
}

// 查看详情
const handleView = async (row: any) => {
  try {
    const res = await getEvaluationDetail(row.id)
    if (res.success) {
      viewData.value = res.result
      viewDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取评价详情失败:', error)
  }
}

// 通过
const handleApprove = (row: any) => {
  ElMessageBox.confirm('确认通过此评价？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateEvaluationStatus(row.id, { status: 'APPROVED' })
      if (res.success) {
        ElMessage.success('操作成功')
        getData()
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  })
}

// 拒绝
const handleReject = (row: any) => {
  ElMessageBox.confirm('确认拒绝此评价？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateEvaluationStatus(row.id, { status: 'REJECTED' })
      if (res.success) {
        ElMessage.success('操作成功')
        getData()
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此评价？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteEvaluation(row.id)
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
.member-review-page {
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

    .image-list {
      display: flex;
      align-items: center;
    }
  }
}
</style>

