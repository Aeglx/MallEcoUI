<template>
  <div class="material-voice-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>语音素材</span>
          <el-button type="primary" @click="handleUpload">
            <el-icon><Plus /></el-icon>
            上传语音
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
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="mediaId" label="MediaID" width="200" show-overflow-tooltip />
        <el-table-column prop="duration" label="时长(秒)" width="100" align="right" />
        <el-table-column prop="createTime" label="上传时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handlePlay(row)">播放</el-button>
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
import { Plus } from '@element-plus/icons-vue'
import { getWechatMaterialList, deleteWechatMaterial } from '@/api/wechat'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const handleUpload = () => {
  console.log('上传语音')
}

const getData = async () => {
  loading.value = true
  try {
    const params = {
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res = await getWechatMaterialList('voice', params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取语音素材失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  getData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  getData()
}

const handlePlay = (row: any) => {
  console.log('播放语音:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此语音？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteWechatMaterial('voice', row.id.toString())
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
.material-voice-page {
  font-size: 12px;
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

