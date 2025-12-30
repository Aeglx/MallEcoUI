<template>
  <div class="goods-list-page">
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
        <el-form-item label="商品编号">
          <el-input
            v-model="searchForm.sn"
            placeholder="请输入商品编号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.categoryId" clearable placeholder="请选择分类" style="width: 200px">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-select v-model="searchForm.marketEnable" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="已上架" value="UPPER" />
            <el-option label="已下架" value="DOWN" />
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
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加商品
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="商品ID" width="120" />
        <el-table-column label="商品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.small || row.thumbnail || defaultImage"
              fit="cover"
              style="width: 60px; height: 60px"
              :preview-src-list="[row.original || row.small || row.thumbnail]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sn" label="商品编号" width="150" />
        <el-table-column prop="price" label="售价" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="库存" width="100" align="right" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="marketEnable" label="上架状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.marketEnable === 'UPPER'" type="success">已上架</el-tag>
            <el-tag v-else type="info">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.marketEnable === 'UPPER' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.marketEnable === 'UPPER' ? '下架' : '上架' }}
            </el-button>
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="商品详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品ID">{{ detailData.id || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品编号">{{ detailData.sn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ detailData.goodsName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品分类">{{ detailData.categoryName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{ detailData.brandName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="售价">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.price || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="原价">¥{{ detailData.originalPrice || '0.00' }}</el-descriptions-item>
        <el-descriptions-item label="库存">{{ detailData.quantity || 0 }}</el-descriptions-item>
        <el-descriptions-item label="上架状态">
          <el-tag v-if="detailData.marketEnable === 'UPPER'" type="success">已上架</el-tag>
          <el-tag v-else type="info">已下架</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="商品图片" :span="2" v-if="detailData.small || detailData.thumbnail">
          <el-image
            :src="detailData.small || detailData.thumbnail"
            fit="cover"
            style="width: 200px; height: 200px"
          />
        </el-descriptions-item>
        <el-descriptions-item label="商品描述" :span="2">{{ detailData.intro || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getGoodsList, getGoodsDetail, deleteGoods, updateGoodsStatus, getCategoryTree } from '@/api/goods'

const defaultImage = '/default-goods.png'

// 搜索表单
const searchForm = reactive({
  goodsName: '',
  sn: '',
  categoryId: '',
  marketEnable: '',
  pageNumber: 1,
  pageSize: 20
})

// 分类选项
const categoryOptions = ref([])

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 加载分类选项
const loadCategoryOptions = async () => {
  try {
    const res = await getCategoryTree()
    if (res.success) {
      const buildOptions = (categories: any[], parentName = ''): any[] => {
        const options: any[] = []
        categories.forEach((cat: any) => {
          const label = parentName ? `${parentName} / ${cat.name}` : cat.name
          options.push({ label, value: cat.id })
          if (cat.children && cat.children.length > 0) {
            options.push(...buildOptions(cat.children, label))
          }
        })
        return options
      }
      categoryOptions.value = buildOptions(res.result || [])
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  searchForm.pageNumber = 1
  pagination.page = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.goodsName = ''
  searchForm.sn = ''
  searchForm.categoryId = ''
  searchForm.marketEnable = ''
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
    const res = await getGoodsList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
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

// 查看详情对话框
const viewDialogVisible = ref(false)
const detailData = reactive({
  id: '',
  sn: '',
  goodsName: '',
  categoryName: '',
  brandName: '',
  price: '0.00',
  originalPrice: '0.00',
  quantity: 0,
  marketEnable: '',
  small: '',
  thumbnail: '',
  intro: '',
  createTime: ''
})

// 添加商品
const handleAdd = () => {
  ElMessage.info('商品添加功能较为复杂，建议使用独立的添加页面')
  // 可以在这里跳转到添加页面或打开对话框
}

// 查看
const handleView = async (row: any) => {
  try {
    const res = await getGoodsDetail(row.id.toString())
    if (res.success && res.result) {
      Object.assign(detailData, {
        id: res.result.id || '',
        sn: res.result.sn || '',
        goodsName: res.result.goodsName || '',
        categoryName: res.result.categoryName || '',
        brandName: res.result.brandName || '',
        price: res.result.price || '0.00',
        originalPrice: res.result.originalPrice || '0.00',
        quantity: res.result.quantity || 0,
        marketEnable: res.result.marketEnable || '',
        small: res.result.small || res.result.thumbnail || '',
        thumbnail: res.result.thumbnail || '',
        intro: res.result.intro || '',
        createTime: res.result.createTime || ''
      })
    } else {
      // 如果获取详情失败，使用行数据
      Object.assign(detailData, {
        id: row.id || '',
        sn: row.sn || '',
        goodsName: row.goodsName || '',
        categoryName: row.categoryName || '',
        brandName: row.brandName || '',
        price: row.price || '0.00',
        originalPrice: row.originalPrice || '0.00',
        quantity: row.quantity || 0,
        marketEnable: row.marketEnable || '',
        small: row.small || row.thumbnail || '',
        thumbnail: row.thumbnail || '',
        intro: row.intro || '',
        createTime: row.createTime || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取商品详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      id: row.id || '',
      sn: row.sn || '',
      goodsName: row.goodsName || '',
      categoryName: row.categoryName || '',
      brandName: row.brandName || '',
      price: row.price || '0.00',
      originalPrice: row.originalPrice || '0.00',
      quantity: row.quantity || 0,
      marketEnable: row.marketEnable || '',
      small: row.small || row.thumbnail || '',
      thumbnail: row.thumbnail || '',
      intro: row.intro || '',
      createTime: row.createTime || ''
    })
    viewDialogVisible.value = true
  }
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info('商品编辑功能较为复杂，建议使用独立的编辑页面')
  // 可以在这里跳转到编辑页面
}

// 切换上架状态
const handleToggleStatus = (row: any) => {
  const action = row.marketEnable === 'UPPER' ? '下架' : '上架'
  ElMessageBox.confirm(`确认${action}此商品？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await updateGoodsStatus(row.id, {
        marketEnable: row.marketEnable === 'UPPER' ? 'DOWN' : 'UPPER'
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

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此商品？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteGoods(row.id)
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
  loadCategoryOptions()
  getData()
})
</script>

<style scoped lang="scss">
.goods-list-page {
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

