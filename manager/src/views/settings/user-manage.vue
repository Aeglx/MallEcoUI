<template>
  <div class="user-manage-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
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
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加用户
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
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column prop="nickname" label="昵称" min-width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="roles" label="角色" min-width="200">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles || []"
              :key="role.id"
              style="margin-right: 5px"
            >
              {{ role.name }}
            </el-tag>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :disabled="!!formData.id"
            placeholder="请输入用户名"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item v-if="!formData.id" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" style="width: 400px" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="formData.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 400px"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
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
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getUserList,
  getUserDetail,
  addUser,
  updateUser,
  deleteUser,
  assignUserRoles,
  getUserRoles,
  getRoleList
} from '@/api/rbac'

const searchForm = reactive({
  username: '',
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
  searchForm.username = ''
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
    const res = await getUserList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
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
const dialogTitle = ref('添加用户')
const formRef = ref()
const formData = reactive({
  id: '',
  username: '',
  password: '',
  nickname: '',
  email: '',
  roleIds: []
})

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (!formData.id && !value) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  roleIds: [{ required: true, message: '请至少选择一个角色', trigger: 'change' }]
}

// 角色列表
const roleList = ref([])

// 获取角色列表
const getRoleListData = async () => {
  try {
    const res = await getRoleList({ pageSize: 1000 })
    const data = res.data || res
    if (data.success) {
      roleList.value = data.result?.records || data.result?.list || data.result || []
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加用户'
  formData.id = ''
  formData.username = ''
  formData.password = ''
  formData.nickname = ''
  formData.email = ''
  formData.roleIds = []
  dialogVisible.value = true
}

const handleEdit = async (row: any) => {
  try {
    const res = await getUserDetail(row.id.toString())
    const data = res.data || res
    if (data.success && data.result) {
      dialogTitle.value = '编辑用户'
      formData.id = data.result.id
      formData.username = data.result.username || ''
      formData.password = ''
      formData.nickname = data.result.nickname || ''
      formData.email = data.result.email || ''
      // 获取用户角色
      try {
        const rolesRes = await getUserRoles(row.id.toString())
        const rolesData = rolesRes.data || rolesRes
        if (rolesData.success && rolesData.result) {
          formData.roleIds = Array.isArray(rolesData.result)
            ? rolesData.result.map((r: any) => r.id || r)
            : []
        } else if (data.result.roles && Array.isArray(data.result.roles)) {
          formData.roleIds = data.result.roles.map((r: any) => r.id || r)
        } else {
          formData.roleIds = []
        }
      } catch (error) {
        // 如果获取角色失败，使用行数据中的角色
        if (row.roles && Array.isArray(row.roles)) {
          formData.roleIds = row.roles.map((r: any) => r.id || r)
        } else {
          formData.roleIds = []
        }
      }
      dialogVisible.value = true
    }
  } catch (error) {
    // 如果获取详情失败，使用行数据
    dialogTitle.value = '编辑用户'
    formData.id = row.id
    formData.username = row.username || ''
    formData.password = ''
    formData.nickname = row.nickname || ''
    formData.email = row.email || ''
    if (row.roles && Array.isArray(row.roles)) {
      formData.roleIds = row.roles.map((r: any) => r.id || r)
    } else {
      formData.roleIds = []
    }
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params: any = {
          username: formData.username,
          nickname: formData.nickname,
          email: formData.email
        }
        if (!formData.id && formData.password) {
          params.password = formData.password
        }

        let res
        if (formData.id) {
          res = await updateUser(formData.id.toString(), params)
          const updateData = res.data || res
          if (updateData.success) {
            // 更新角色
            if (formData.roleIds && formData.roleIds.length > 0) {
              await assignUserRoles(formData.id.toString(), formData.roleIds)
            }
            ElMessage.success('修改成功')
            dialogVisible.value = false
            getData()
          }
        } else {
          res = await addUser(params)
          const addData = res.data || res
          if (addData.success) {
            const userId = addData.result?.id || addData.result
            if (userId && formData.roleIds && formData.roleIds.length > 0) {
              await assignUserRoles(userId.toString(), formData.roleIds)
            }
            ElMessage.success('添加成功')
            dialogVisible.value = false
            getData()
          }
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '操作失败')
      }
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此用户？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteUser(row.id.toString())
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
  getRoleListData()
  getData()
})
</script>

<style scoped lang="scss">
.user-manage-page {
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

