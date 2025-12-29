<template>
  <div class="coupon-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input
            v-model="searchForm.couponName"
            placeholder="请输入优惠券名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="获取方式">
          <el-select v-model="searchForm.getType" clearable placeholder="请选择" style="width: 200px">
            <el-option label="免费获取" value="FREE" />
            <el-option label="活动获取" value="ACTIVITY" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="searchForm.promotionStatus" clearable placeholder="请选择" style="width: 200px">
            <el-option label="未开始" value="NEW" />
            <el-option label="已开始" value="START" />
            <el-option label="已结束" value="END" />
            <el-option label="已关闭" value="CLOSE" />
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
          <span>优惠券列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加优惠券
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
        <el-table-column prop="couponName" label="优惠券名称" min-width="180" />
        <el-table-column label="面额/折扣" width="150">
          <template #default="{ row }">
            <span v-if="row.price">¥{{ row.price }}</span>
            <span v-else>{{ row.couponDiscount }}折</span>
          </template>
        </el-table-column>
        <el-table-column label="已领取/总数量" width="180">
          <template #default="{ row }">
            {{ row.receivedNum || 0 }}/{{ row.publishNum === 0 ? '不限制' : row.publishNum }}
          </template>
        </el-table-column>
        <el-table-column label="已使用/已领取" width="150">
          <template #default="{ row }">
            {{ row.usedNum || 0 }}/{{ row.receivedNum || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="getType" label="获取方式" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.getType === 'FREE'" type="danger">免费获取</el-tag>
            <el-tag v-else-if="row.getType === 'ACTIVITY'" type="warning">活动获取</el-tag>
            <el-tag v-else>其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="couponType" label="优惠券类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.couponType === 'DISCOUNT'" type="primary">打折</el-tag>
            <el-tag v-else type="success">减免现金</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="promotionStatus" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.promotionStatus === 'START'" type="success">已开始</el-tag>
            <el-tag v-else-if="row.promotionStatus === 'NEW'" type="info">未开始</el-tag>
            <el-tag v-else-if="row.promotionStatus === 'END'" type="warning">已结束</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getCouponList, deleteCoupon } from '@/api/promotion'

const searchForm = reactive({
  couponName: '',
  getType: '',
  promotionStatus: '',
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
  searchForm.couponName = ''
  searchForm.getType = ''
  searchForm.promotionStatus = ''
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
    const res = await getCouponList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
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

const handleAdd = () => {
  console.log('添加优惠券')
}

const handleView = (row: any) => {
  console.log('查看优惠券:', row)
}

const handleEdit = (row: any) => {
  console.log('编辑优惠券:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此优惠券？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteCoupon(row.id)
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
.coupon-page {
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

