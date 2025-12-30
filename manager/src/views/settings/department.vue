<template>
  <div class="department-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加部门
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
        <el-table-column prop="name" label="部门名称" min-width="200" />
        <el-table-column prop="code" label="部门编码" width="150" />
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
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
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" style="width: 300px" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入部门编码" style="width: 300px" />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="formData.parentId" clearable placeholder="请选择上级部门" style="width: 300px">
            <el-option label="顶级部门" :value="null" />
            <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="formData.leader" placeholder="请输入负责人" style="width: 300px" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" style="width: 300px" />
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
import {
  getDepartmentTree,
  getDepartmentDetail,
  addDepartment,
  updateDepartment,
  deleteDepartment
} from '@/api/rbac'

const loading = ref(false)
const tableData = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加部门')
const formRef = ref()
const formData = reactive({
  id: '',
  name: '',
  code: '',
  parentId: null as number | null,
  leader: '',
  phone: ''
})

const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }]
}

// 上级部门选项（排除自己和子部门）
const parentOptions = computed(() => {
  const buildOptions = (departments: any[], parentName = '', excludeId?: number): any[] => {
    const options: any[] = []
    departments.forEach((dept: any) => {
      if (dept.id !== excludeId) {
        const label = parentName ? `${parentName} / ${dept.name}` : dept.name
        options.push({ label, value: dept.id })
        if (dept.children && dept.children.length > 0) {
          options.push(...buildOptions(dept.children, label, excludeId))
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
    const res = await getDepartmentTree()
    const data = res.data || res
    if (data.success) {
      tableData.value = data.result || []
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加部门'
  formData.id = ''
  formData.name = ''
  formData.code = ''
  formData.parentId = null
  formData.leader = ''
  formData.phone = ''
  dialogVisible.value = true
}

const handleEdit = async (row: any) => {
  try {
    const res = await getDepartmentDetail(row.id.toString())
    const data = res.data || res
    if (data.success && data.result) {
      dialogTitle.value = '编辑部门'
      formData.id = data.result.id
      formData.name = data.result.name || ''
      formData.code = data.result.code || ''
      formData.parentId = data.result.parentId || null
      formData.leader = data.result.leader || ''
      formData.phone = data.result.phone || ''
      dialogVisible.value = true
    }
  } catch (error) {
    // 使用行数据
    dialogTitle.value = '编辑部门'
    formData.id = row.id
    formData.name = row.name || ''
    formData.code = row.code || ''
    formData.parentId = row.parentId || null
    formData.leader = row.leader || ''
    formData.phone = row.phone || ''
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params: any = {
          name: formData.name,
          code: formData.code,
          leader: formData.leader,
          phone: formData.phone
        }
        if (formData.parentId !== null) {
          params.parentId = formData.parentId
        }

        let res
        if (formData.id) {
          res = await updateDepartment(formData.id.toString(), params)
        } else {
          res = await addDepartment(params)
        }
        const data = res.data || res
        if (data.success) {
          ElMessage.success(formData.id ? '修改成功' : '添加成功')
          dialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '操作失败')
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此部门？删除后部门下的用户将移入默认部门', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteDepartment(row.id.toString())
      const data = res.data || res
      if (data.success) {
        ElMessage.success('删除成功')
        getData()
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '删除失败')
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.department-page {
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

