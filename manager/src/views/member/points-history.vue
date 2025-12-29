<template>
  <div class="points-history-page">
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
        <el-form-item label="积分类型">
          <el-select v-model="searchForm.type" clearable placeholder="请选择类型" style="width: 200px">
            <el-option label="收入" value="INCOME" />
            <el-option label="支出" value="EXPENSE" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
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
        <el-table-column prop="id" label="记录ID" width="120" />
        <el-table-column prop="memberId" label="会员ID" width="120" />
        <el-table-column prop="memberName" label="会员名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'INCOME'" type="success">收入</el-tag>
            <el-tag v-else type="danger">支出</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分数量" width="120" align="right">
          <template #default="{ row }">
            <span :class="row.type === 'INCOME' ? 'income' : 'expense'">
              {{ row.type === 'INCOME' ? '+' : '-' }}{{ row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="beforePoints" label="变动前积分" width="120" align="right" />
        <el-table-column prop="afterPoints" label="变动后积分" width="120" align="right" />
        <el-table-column prop="source" label="来源" min-width="150" show-overflow-tooltip />
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="时间" width="160" />
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getPointLog } from '@/api/member'

// 搜索表单
const searchForm = reactive({
  memberId: '',
  memberName: '',
  type: '',
  dateRange: [],
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

// 搜索
const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.memberId = ''
  searchForm.memberName = ''
  searchForm.type = ''
  searchForm.dateRange = []
  handleSearch()
}

// 获取数据
const getData = async () => {
  loading.value = true
  try {
    const params: any = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    
    // 处理日期范围
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    delete params.dateRange
    
    const res = await getPointLog(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取积分历史失败:', error)
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

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.points-history-page {
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

    .income {
      color: #67c23a;
      font-weight: bold;
    }

    .expense {
      color: #f56c6c;
      font-weight: bold;
    }
  }
}
</style>

