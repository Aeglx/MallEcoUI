<template>
  <div class="goods-audit-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.goodsName"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.auditStatus" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="审核通过" value="APPROVED" />
            <el-option label="审核拒绝" value="REJECTED" />
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
        <el-table-column prop="id" label="商品ID" width="120" />
        <el-table-column label="商品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.small || row.thumbnail"
              fit="cover"
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="price" label="售价" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="auditStatus" label="审核状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.auditStatus === 'APPROVED'" type="success">审核通过</el-tag>
            <el-tag v-else-if="row.auditStatus === 'REJECTED'" type="danger">审核拒绝</el-tag>
            <el-tag v-else type="warning">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.auditStatus === 'PENDING'"
              link
              type="success"
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.auditStatus === 'PENDING'"
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
    <el-dialog v-model="viewDialogVisible" title="商品详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品ID">{{ detailData.id || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ detailData.goodsName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="售价">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.price || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="分类">{{ detailData.categoryName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag v-if="detailData.auditStatus === 'APPROVED'" type="success">审核通过</el-tag>
          <el-tag v-else-if="detailData.auditStatus === 'REJECTED'" type="danger">审核拒绝</el-tag>
          <el-tag v-else type="warning">待审核</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ detailData.auditTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核原因" :span="2">{{ detailData.auditRemark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品图片" :span="2" v-if="detailData.small || detailData.thumbnail">
          <el-image
            :src="detailData.small || detailData.thumbnail"
            fit="cover"
            style="width: 200px; height: 200px"
          />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝审核对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝审核" width="500px">
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectFormRules" label-width="100px">
        <el-form-item label="拒绝原因" prop="auditRemark">
          <el-input
            v-model="rejectForm.auditRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRejectSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getGoodsList, getGoodsDetail, updateGoodsStatus } from '@/api/goods'

const searchForm = reactive({
  goodsName: '',
  auditStatus: 'PENDING',
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
  searchForm.goodsName = ''
  searchForm.auditStatus = 'PENDING'
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
    const res = await getGoodsList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取商品审核列表失败:', error)
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
  id: '',
  goodsName: '',
  price: '0.00',
  categoryName: '',
  auditStatus: '',
  auditTime: '',
  auditRemark: '',
  small: '',
  thumbnail: ''
})

const handleView = async (row: any) => {
  try {
    const res = await getGoodsDetail(row.id.toString())
    if (res.success && res.result) {
      Object.assign(detailData, {
        id: res.result.id || '',
        goodsName: res.result.goodsName || '',
        price: res.result.price || '0.00',
        categoryName: res.result.categoryName || '',
        auditStatus: res.result.auditStatus || '',
        auditTime: res.result.auditTime || '',
        auditRemark: res.result.auditRemark || '',
        small: res.result.small || res.result.thumbnail || '',
        thumbnail: res.result.thumbnail || ''
      })
    } else {
      // 使用行数据
      Object.assign(detailData, {
        id: row.id || '',
        goodsName: row.goodsName || '',
        price: row.price || '0.00',
        categoryName: row.categoryName || '',
        auditStatus: row.auditStatus || '',
        auditTime: row.auditTime || '',
        auditRemark: row.auditRemark || '',
        small: row.small || row.thumbnail || '',
        thumbnail: row.thumbnail || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取商品详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      id: row.id || '',
      goodsName: row.goodsName || '',
      price: row.price || '0.00',
      categoryName: row.categoryName || '',
      auditStatus: row.auditStatus || '',
      auditTime: row.auditTime || '',
      auditRemark: row.auditRemark || '',
      small: row.small || row.thumbnail || '',
      thumbnail: row.thumbnail || ''
    })
    viewDialogVisible.value = true
  }
}

const handleApprove = (row: any) => {
  ElMessageBox.confirm('确认审核通过此商品？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateGoodsStatus(row.id.toString(), { auditStatus: 'APPROVED' })
      if (res.success) {
        ElMessage.success('审核通过')
        getData()
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '审核失败')
    }
  })
}

// 拒绝审核对话框
const rejectDialogVisible = ref(false)
const rejectFormRef = ref()
const rejectForm = reactive({
  id: '',
  auditRemark: ''
})

const rejectFormRules = {
  auditRemark: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
}

const handleReject = (row: any) => {
  rejectForm.id = row.id
  rejectForm.auditRemark = ''
  rejectDialogVisible.value = true
}

const handleRejectSubmit = async () => {
  if (!rejectFormRef.value) return
  await rejectFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await updateGoodsStatus(rejectForm.id.toString(), {
          auditStatus: 'REJECTED',
          auditRemark: rejectForm.auditRemark
        })
        if (res.success) {
          ElMessage.success('已拒绝')
          rejectDialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '审核失败')
      }
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.goods-audit-page {
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


