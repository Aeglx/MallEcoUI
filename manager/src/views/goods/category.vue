<template>
  <div class="category-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>商品分类</span>
          <el-button type="primary" @click="handleAddParent">
            <el-icon><Plus /></el-icon>
            添加一级分类
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
        <el-table-column prop="image" label="分类图标" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              fit="cover"
              style="width: 60px; height: 60px"
            />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序值" width="100" align="center" />
        <el-table-column prop="commissionRate" label="佣金比例(%)" width="120" align="right">
          <template #default="{ row }">
            {{ row.commissionRate || 0 }}%
          </template>
        </el-table-column>
        <el-table-column prop="deleteFlag" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="!row.deleteFlag" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.deleteFlag ? 'success' : 'danger'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.deleteFlag ? '启用' : '禁用' }}
            </el-button>
            <el-button
              v-if="row.level !== 2"
              link
              type="primary"
              size="small"
              @click="handleAddChild(row)"
            >
              添加子分类
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item v-if="showParent" label="上级分类">
          <span>{{ parentTitle }}</span>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item v-if="form.level !== 1" label="分类图标" prop="image">
          <el-input v-model="form.image" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="排序值" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="佣金比例(%)" prop="commissionRate">
          <el-input-number v-model="form.commissionRate" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.deleteFlag" :active-value="false" :inactive-value="true" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  updateGoodsStatus
} from '@/api/goods'

const loading = ref(false)
const tableData = ref([])

const dialogVisible = ref(false)
const dialogTitle = ref('添加分类')
const showParent = ref(false)
const parentTitle = ref('')
const formRef = ref()
const form = reactive({
  id: '',
  parentId: '',
  name: '',
  image: '',
  level: 1,
  sortOrder: 0,
  commissionRate: 0,
  deleteFlag: false
})

const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
}

const handleAddParent = () => {
  dialogTitle.value = '添加一级分类'
  showParent.value = false
  Object.assign(form, {
    id: '',
    parentId: '',
    name: '',
    image: '',
    level: 1,
    sortOrder: 0,
    commissionRate: 0,
    deleteFlag: false
  })
  dialogVisible.value = true
}

const handleAddChild = (row: any) => {
  dialogTitle.value = '添加子分类'
  showParent.value = true
  parentTitle.value = row.name
  Object.assign(form, {
    id: '',
    parentId: row.id,
    name: '',
    image: '',
    level: row.level + 1,
    sortOrder: 0,
    commissionRate: 0,
    deleteFlag: false
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑分类'
  showParent.value = row.level > 1
  Object.assign(form, {
    id: row.id,
    parentId: row.parentId || '',
    name: row.name,
    image: row.image || '',
    level: row.level,
    sortOrder: row.sortOrder || 0,
    commissionRate: row.commissionRate || 0,
    deleteFlag: row.deleteFlag === false ? false : true
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        let res
        if (form.id) {
          res = await updateCategory(form.id, form)
        } else {
          res = await addCategory(form)
        }
        if (res.success) {
          ElMessage.success(form.id ? '修改成功' : '添加成功')
          dialogVisible.value = false
          getData()
        }
      } catch (error) {
        console.error('操作失败:', error)
      }
    }
  })
}

const handleToggleStatus = (row: any) => {
  const action = row.deleteFlag ? '启用' : '禁用'
  ElMessageBox.confirm(`确认${action}此分类？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateCategory(row.id, {
        deleteFlag: !row.deleteFlag
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

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此分类？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteCategory(row.id)
      if (res.success) {
        ElMessage.success('删除成功')
        getData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const getData = async () => {
  loading.value = true
  try {
    const res = await getCategoryList()
    if (res.success) {
      tableData.value = res.result || []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.category-page {
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

