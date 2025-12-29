<template>
  <div class="menu-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加菜单
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
        <el-table-column prop="title" label="菜单名称" min-width="200" />
        <el-table-column prop="path" label="路径" min-width="200" />
        <el-table-column prop="icon" label="图标" width="120" />
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
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
import { getMenuTree, deleteMenu } from '@/api/rbac'

const loading = ref(false)
const tableData = ref([])

const getData = async () => {
  loading.value = true
  try {
    const res = await getMenuTree()
    if (res.success) {
      tableData.value = res.result || []
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  console.log('添加菜单')
}

const handleEdit = (row: any) => {
  console.log('编辑菜单:', row)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此菜单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteMenu(row.id.toString())
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
.menu-page {
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

