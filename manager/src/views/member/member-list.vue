<template>
  <div class="member-list-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="会员ID">
          <el-input
            v-model="searchForm.id"
            placeholder="请输入会员ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="会员名称">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入会员名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="会员昵称">
          <el-input
            v-model="searchForm.nickName"
            placeholder="请输入会员昵称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="searchForm.mobile"
            placeholder="请输入联系方式"
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
          <span>会员列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加会员
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
        <el-table-column prop="id" label="会员ID" width="120" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.face || defaultAvatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="会员名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="nickName" label="会员昵称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="mobile" label="联系方式" width="130" />
        <el-table-column prop="createTime" label="注册时间" width="160" />
        <el-table-column prop="lastLoginDate" label="最后登录时间" width="160" />
        <el-table-column prop="point" label="积分数量" width="120" align="right">
          <template #default="{ row }">
            {{ row.point || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDisable(row)">禁用</el-button>
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

    <!-- 添加会员对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加会员" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength="11" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="会员名称" prop="username">
          <el-input v-model="addForm.username" maxlength="15" placeholder="请输入会员名称" />
        </el-form-item>
        <el-form-item label="会员密码" prop="password">
          <el-input
            v-model="addForm.password"
            type="password"
            maxlength="20"
            placeholder="请输入会员密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑会员对话框 -->
    <el-dialog v-model="editDialogVisible" :title="editTitle" width="600px">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="头像">
          <div class="avatar-container">
            <el-avatar :src="editForm.face || defaultAvatar" :size="60" />
            <el-button type="text" @click="showImageSelector = true">修改</el-button>
          </div>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled style="width: 300px" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="editForm.nickName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="修改密码" prop="newPassword">
          <el-input
            v-model="editForm.newPassword"
            type="password"
            style="width: 300px"
            placeholder="留空则不修改密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="所在地">
          <span>{{ editForm.region || '暂无地址' }}</span>
          <el-button type="text" style="margin-left: 10px">选择</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getMember, getMemberDetail, addMember, updateMember, updateMemberStatus } from '@/api/member'

const defaultAvatar = '/default-avatar.png'

// 搜索表单
const searchForm = reactive({
  id: '',
  username: '',
  nickName: '',
  mobile: '',
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

// 添加对话框
const addDialogVisible = ref(false)
const addFormRef = ref()
const addForm = reactive({
  mobile: '',
  username: '',
  password: ''
})

const addFormRules = {
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  username: [{ required: true, message: '请输入会员名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 编辑对话框
const editDialogVisible = ref(false)
const editTitle = ref('编辑会员')
const editFormRef = ref()
const editForm = reactive({
  id: '',
  username: '',
  nickName: '',
  sex: 1,
  face: '',
  newPassword: '',
  birthday: '',
  region: ''
})

const editFormRules = {
  nickName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
}

const showImageSelector = ref(false)

// 搜索
const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.id = ''
  searchForm.username = ''
  searchForm.nickName = ''
  searchForm.mobile = ''
  handleSearch()
}

// 获取数据
const getData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res = await getMember(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取会员列表失败:', error)
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

// 添加会员
const handleAdd = () => {
  addForm.mobile = ''
  addForm.username = ''
  addForm.password = ''
  addDialogVisible.value = true
}

// 添加提交
const handleAddSubmit = async () => {
  if (!addFormRef.value) return
  await addFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await addMember(addForm)
        if (res.success) {
          ElMessage.success('添加成功')
          addDialogVisible.value = false
          getData()
        }
      } catch (error) {
        console.error('添加会员失败:', error)
      }
    }
  })
}

// 查看详情
const handleView = (row: any) => {
  // 可以跳转到详情页或打开详情对话框
  console.log('查看会员:', row)
}

// 编辑会员
const handleEdit = async (row: any) => {
  try {
    const res = await getMemberDetail(row.id)
    if (res.success) {
      Object.assign(editForm, {
        id: res.result.id,
        username: res.result.username,
        nickName: res.result.nickName || '',
        sex: res.result.sex ?? 1,
        face: res.result.face || '',
        newPassword: '',
        birthday: res.result.birthday || '',
        region: res.result.region || ''
      })
      editTitle.value = `编辑会员 ${res.result.username}`
      editDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取会员详情失败:', error)
  }
}

// 编辑提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  await editFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params: any = {
          id: editForm.id,
          nickName: editForm.nickName,
          sex: editForm.sex,
          face: editForm.face,
          birthday: editForm.birthday,
          region: editForm.region
        }
        if (editForm.newPassword) {
          params.password = editForm.newPassword
        }
        const res = await updateMember(editForm.id, params)
        if (res.success) {
          ElMessage.success('修改成功')
          editDialogVisible.value = false
          getData()
        }
      } catch (error) {
        console.error('修改会员失败:', error)
      }
    }
  })
}

// 禁用会员
const handleDisable = (row: any) => {
  ElMessageBox.confirm('确认禁用此会员？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateMemberStatus(row.id, { disabled: true })
      if (res.success) {
        ElMessage.success('禁用成功')
        getData()
      }
    } catch (error) {
      console.error('禁用会员失败:', error)
    }
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.member-list-page {
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

  .avatar-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>

