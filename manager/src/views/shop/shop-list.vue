<template>
  <div class="shop-list-page">
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
        <el-form-item label="店铺状态">
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="营业中" value="OPEN" />
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
        <el-table-column prop="id" label="店铺ID" width="120" />
        <el-table-column prop="shopName" label="店铺名称" min-width="200" />
        <el-table-column prop="ownerName" label="店主" min-width="120" />
        <el-table-column prop="mobile" label="联系方式" width="150" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'OPEN'" type="success">营业中</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 'OPEN' ? 'danger' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'OPEN' ? '关闭' : '开启' }}
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
    <el-dialog v-model="viewDialogVisible" title="店铺详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="店铺ID">{{ detailData.id || '-' }}</el-descriptions-item>
        <el-descriptions-item label="店铺名称">{{ detailData.shopName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="店主">{{ detailData.ownerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detailData.mobile || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.status === 'OPEN'" type="success">营业中</el-tag>
          <el-tag v-else type="danger">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="店铺地址" :span="2">{{ detailData.address || '-' }}</el-descriptions-item>
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getShopList, getShopDetail, updateShopStatus } from '@/api/shop'

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
    const res = await getShopList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
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
  shopName: '',
  ownerName: '',
  mobile: '',
  status: '',
  address: '',
  createTime: ''
})

const handleView = async (row: any) => {
  try {
    const res = await getShopDetail(row.id.toString())
    if (res.success && res.result) {
      Object.assign(detailData, {
        id: res.result.id || '',
        shopName: res.result.shopName || '',
        ownerName: res.result.ownerName || '',
        mobile: res.result.mobile || '',
        status: res.result.status || '',
        address: res.result.address || '',
        createTime: res.result.createTime || ''
      })
    } else {
      // 使用行数据
      Object.assign(detailData, {
        id: row.id || '',
        shopName: row.shopName || '',
        ownerName: row.ownerName || '',
        mobile: row.mobile || '',
        status: row.status || '',
        address: row.address || '',
        createTime: row.createTime || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      id: row.id || '',
      shopName: row.shopName || '',
      ownerName: row.ownerName || '',
      mobile: row.mobile || '',
      status: row.status || '',
      address: row.address || '',
      createTime: row.createTime || ''
    })
    viewDialogVisible.value = true
  }
}

const handleEdit = (row: any) => {
  ElMessage.info('店铺编辑功能较为复杂，建议使用独立的编辑页面')
}

const handleToggleStatus = (row: any) => {
  const action = row.status === 'OPEN' ? '关闭' : '开启'
  ElMessageBox.confirm(`确认${action}此店铺？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateShopStatus(row.id, {
        status: row.status === 'OPEN' ? 'CLOSED' : 'OPEN'
      })
      if (res.success) {
        ElMessage.success(`${action}成功`)
        getData()
      }
    } catch (error) {
      console.error(`${action}失败:`, error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.shop-list-page {
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

