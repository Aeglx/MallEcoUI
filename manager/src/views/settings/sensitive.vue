<template>
  <div class="sensitive-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="敏感词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入敏感词"
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
      <template #header>
        <div class="card-header">
          <span>敏感词管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加敏感词
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
        <el-table-column prop="word" label="敏感词" min-width="200" />
        <el-table-column prop="replaceWord" label="替换词" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'FORBID'" type="danger">禁止</el-tag>
            <el-tag v-else type="warning">替换</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="敏感词" prop="word">
          <el-input v-model="formData.word" placeholder="请输入敏感词" maxlength="50" />
        </el-form-item>
        <el-form-item label="替换词" prop="replaceWord">
          <el-input v-model="formData.replaceWord" placeholder="请输入替换词（类型为替换时必填）" maxlength="50" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="FORBID">禁止</el-radio>
            <el-radio label="REPLACE">替换</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'

const searchForm = reactive({
  keyword: '',
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
  searchForm.keyword = ''
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
    // const res = await getSensitiveWordsList(params)
    // if (res.success) {
    //   tableData.value = res.result?.records || res.result?.list || res.result || []
    //   pagination.total = res.result?.total || 0
    // }
  } catch (error) {
    console.error('获取敏感词列表失败:', error)
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
const dialogTitle = ref('添加敏感词')
const formRef = ref()
const formData = reactive({
  id: '',
  word: '',
  replaceWord: '',
  type: 'FORBID'
})

const formRules = {
  word: [{ required: true, message: '请输入敏感词', trigger: 'blur' }],
  replaceWord: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (formData.type === 'REPLACE' && !value) {
          callback(new Error('替换类型时必须输入替换词'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听类型变化，清除替换词验证
watch(
  () => formData.type,
  () => {
    if (formData.type === 'FORBID') {
      formData.replaceWord = ''
    }
    if (formRef.value) {
      formRef.value.clearValidate('replaceWord')
    }
  }
)

const handleAdd = () => {
  dialogTitle.value = '添加敏感词'
  formData.id = ''
  formData.word = ''
  formData.replaceWord = ''
  formData.type = 'FORBID'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑敏感词'
  formData.id = row.id
  formData.word = row.word || ''
  formData.replaceWord = row.replaceWord || ''
  formData.type = row.type || 'FORBID'
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // const res = formData.id
        //   ? await updateSensitiveWord(formData.id, formData)
        //   : await addSensitiveWord(formData)
        // if (res.success) {
        //   ElMessage.success(formData.id ? '修改成功' : '添加成功')
        //   dialogVisible.value = false
        //   getData()
        // }
        ElMessage.success(formData.id ? '修改成功' : '添加成功')
        dialogVisible.value = false
        getData()
      } catch (error: any) {
        ElMessage.error(error?.message || '操作失败')
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此敏感词？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // const res = await deleteSensitiveWord(row.id)
      // if (res.success) {
      //   ElMessage.success('删除成功')
      //   getData()
      // }
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
.sensitive-page {
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

