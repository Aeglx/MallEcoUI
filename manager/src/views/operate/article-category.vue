<template>
  <div class="article-category-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>文章分类</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="sortOrder" label="排序值" width="100" align="center" />
        <el-table-column prop="articleCount" label="文章数量" width="100" align="right" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" style="width: 300px" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-select v-model="formData.parentId" clearable placeholder="请选择上级分类" style="width: 300px">
            <el-option label="顶级分类" :value="null" />
            <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序值" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" style="width: 200px" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getArticleCategoryList } from '@/api/operate'

const loading = ref(false)
const tableData = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加分类')
const formRef = ref()
const formData = reactive({
  id: '',
  name: '',
  parentId: null as number | null,
  sortOrder: 0
})

const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
}

// 上级分类选项（排除自己和子分类）
const parentOptions = computed(() => {
  const buildOptions = (categories: any[], parentName = '', excludeId?: number): any[] => {
    const options: any[] = []
    categories.forEach((cat: any) => {
      if (cat.id !== excludeId) {
        const label = parentName ? `${parentName} / ${cat.name}` : cat.name
        options.push({ label, value: cat.id })
        if (cat.children && cat.children.length > 0) {
          options.push(...buildOptions(cat.children, label, excludeId))
        }
      }
    })
    return options
  }
  return buildOptions(tableData.value, '', formData.id ? Number(formData.id) : undefined)
})

const getData = async () => {
  loading.value = true
  try {
    const res = await getArticleCategoryList()
    const data = res.data || res
    if (data.success) {
      tableData.value = data.result || []
    }
  } catch (error) {
    console.error('获取文章分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加分类'
  formData.id = ''
  formData.name = ''
  formData.parentId = null
  formData.sortOrder = 0
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑分类'
  formData.id = row.id
  formData.name = row.name || ''
  formData.parentId = row.parentId || null
  formData.sortOrder = row.sortOrder || 0
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.info('文章分类的添加/编辑功能需要后端提供相应API支持')
      dialogVisible.value = false
      // TODO: 调用添加/编辑API
      // const params = { ...formData }
      // if (formData.id) {
      //   updateArticleCategory(formData.id, params)
      // } else {
      //   addArticleCategory(params)
      // }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此分类？删除后分类下的文章将移入默认分类', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.info('删除功能需要后端提供相应API支持')
    // TODO: 调用删除API
    // deleteArticleCategory(row.id).then(() => {
    //   ElMessage.success('删除成功')
    //   getData()
    // })
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.article-category-page {
  font-size: 12px;
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

