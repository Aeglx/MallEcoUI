<template>
  <div class="live-goods-page">
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
        <el-form-item label="直播间">
          <el-select v-model="searchForm.roomId" clearable placeholder="请选择直播间" style="width: 200px">
            <el-option
              v-for="item in roomOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="goodsName" label="商品名称" min-width="200" />
        <el-table-column prop="roomName" label="直播间" min-width="150" />
        <el-table-column prop="livePrice" label="直播价" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.livePrice || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="right" />
        <el-table-column prop="sales" label="销量" width="100" align="right" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getLiveGoodsList, getLiveRoomList } from '@/api/live'

const searchForm = reactive({
  goodsName: '',
  roomId: '',
  pageNumber: 1,
  pageSize: 20
})

const roomOptions = ref([])
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const loadRoomOptions = async () => {
  try {
    const res = await getLiveRoomList({ pageNumber: 1, pageSize: 100 })
    if (res.success) {
      const list = res.result?.records || res.result?.list || res.result || []
      roomOptions.value = list.map((item: any) => ({
        label: item.roomName,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('加载直播间列表失败:', error)
  }
}

const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

const handleReset = () => {
  searchForm.goodsName = ''
  searchForm.roomId = ''
  handleSearch()
}

const getData = async () => {
  loading.value = true
  try {
    const params: any = {
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchForm.roomId) {
      const res = await getLiveGoodsList(searchForm.roomId.toString(), params)
      if (res.success) {
        tableData.value = res.result?.records || res.result?.list || res.result || []
        pagination.total = res.result?.total || 0
      }
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取直播商品列表失败:', error)
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

const handleView = (row: any) => {
  console.log('查看商品:', row)
}

const handleEdit = (row: any) => {
  console.log('编辑商品:', row)
}

onMounted(() => {
  loadRoomOptions()
  getData()
})
</script>

<style scoped lang="scss">
.live-goods-page {
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

