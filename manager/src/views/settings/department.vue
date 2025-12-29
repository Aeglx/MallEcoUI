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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getDepartmentTree, deleteDepartment } from '@/api/rbac'

const loading = ref(false)
const tableData = ref([])

const getData = async () => {
  loading.value = true
  try {
    const res = await getDepartmentTree()
    if (res.success) {
      tableData.value = res.result || []
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  console.log('添加部门')
}

const handleEdit = (row: any) => {
  console.log('编辑部门:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此部门？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteDepartment(row.id.toString())
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

