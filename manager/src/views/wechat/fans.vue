<template>
  <div class="fans-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="昵称">
          <el-input
            v-model="searchForm.nickname"
            placeholder="请输入昵称"
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
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.headimgurl" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="150" />
        <el-table-column prop="openid" label="OpenID" width="200" show-overflow-tooltip />
        <el-table-column prop="subscribe" label="关注状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.subscribe" type="success">已关注</el-tag>
            <el-tag v-else type="info">未关注</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subscribeTime" label="关注时间" width="160" />
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="粉丝详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="头像" :span="2">
          <el-avatar :src="detailData.headimgurl" :size="80" />
        </el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detailData.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="OpenID">{{ detailData.openid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="关注状态">
          <el-tag v-if="detailData.subscribe" type="success">已关注</el-tag>
          <el-tag v-else type="info">未关注</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          <span v-if="detailData.sex === 1">男</span>
          <span v-else-if="detailData.sex === 2">女</span>
          <span v-else>未知</span>
        </el-descriptions-item>
        <el-descriptions-item label="关注时间">{{ detailData.subscribeTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="取消关注时间" v-if="detailData.unsubscribeTime">
          {{ detailData.unsubscribeTime }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getWechatFansList } from '@/api/wechat'

const searchForm = reactive({
  nickname: '',
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
  searchForm.nickname = ''
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
    const res = await getWechatFansList(params)
    const data = res.data || res
    if (data.success) {
      tableData.value = data.result?.records || data.result?.list || data.result || []
      pagination.total = data.result?.total || 0
    }
  } catch (error) {
    console.error('获取粉丝列表失败:', error)
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
  nickname: '',
  openid: '',
  headimgurl: '',
  subscribe: false,
  sex: 0,
  subscribeTime: '',
  unsubscribeTime: '',
  remark: ''
})

const handleView = (row: any) => {
  Object.assign(detailData, {
    nickname: row.nickname || '',
    openid: row.openid || '',
    headimgurl: row.headimgurl || '',
    subscribe: row.subscribe || false,
    sex: row.sex || 0,
    subscribeTime: row.subscribeTime || '',
    unsubscribeTime: row.unsubscribeTime || '',
    remark: row.remark || ''
  })
  viewDialogVisible.value = true
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.fans-page {
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

