<template>
  <div class="enhanced-table">
    <!-- 搜索栏 -->
    <div v-if="showSearch" class="search-bar">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item
          v-for="item in searchItems"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input
            v-if="item.type === 'input'"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="searchForm[item.prop]"
            type="date"
            :placeholder="item.placeholder || `请选择${item.label}`"
            style="width: 200px"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-else-if="item.type === 'daterange'"
            v-model="searchForm[item.prop]"
            type="daterange"
            :placeholder="item.placeholder || `请选择${item.label}`"
            style="width: 240px"
            value-format="YYYY-MM-DD"
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
    </div>

    <!-- 操作栏 -->
    <div v-if="showToolbar" class="toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right" />
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="showSelection" type="selection" width="55" align="center" />
      <el-table-column v-if="showIndex" type="index" label="序号" width="60" align="center" />
      <slot />
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import type { TableColumnCtx } from 'element-plus'

interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange'
  placeholder?: string
  options?: Array<{ label: string; value: any }>
}

interface Props {
  // 表格数据
  data: any[]
  // 加载状态
  loading?: boolean
  // 表格配置
  stripe?: boolean
  border?: boolean
  height?: string | number
  maxHeight?: string | number
  rowKey?: string
  // 搜索配置
  showSearch?: boolean
  searchItems?: SearchItem[]
  // 工具栏
  showToolbar?: boolean
  // 选择列
  showSelection?: boolean
  // 序号列
  showIndex?: boolean
  // 分页配置
  showPagination?: boolean
  page?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  stripe: true,
  border: false,
  showSearch: true,
  searchItems: () => [],
  showToolbar: true,
  showSelection: false,
  showIndex: true,
  showPagination: true,
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  search: [form: Record<string, any>]
  reset: []
  selectionChange: [selection: any[]]
  sortChange: [sort: { prop: string; order: string }]
  pageChange: [page: number]
  sizeChange: [size: number]
}>()

const tableData = ref(props.data)
const searchForm = reactive<Record<string, any>>({})

// 初始化搜索表单
const initSearchForm = () => {
  props.searchItems.forEach((item) => {
    searchForm[item.prop] = item.type === 'daterange' ? [] : ''
  })
}

// 初始化
initSearchForm()

// 监听 data 变化
watch(
  () => props.data,
  (newData) => {
    tableData.value = newData
  },
  { deep: true }
)

const pagination = reactive({
  page: props.page,
  pageSize: props.pageSize,
  total: props.total
})

// 监听分页变化
watch(
  () => props.page,
  (newPage) => {
    pagination.page = newPage
  }
)

watch(
  () => props.pageSize,
  (newPageSize) => {
    pagination.pageSize = newPageSize
  }
)

watch(
  () => props.total,
  (newTotal) => {
    pagination.total = newTotal
  }
)

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  initSearchForm()
  emit('reset')
  emit('search', { ...searchForm })
}

const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handleSortChange = (sort: { prop: string; order: string }) => {
  emit('sortChange', sort)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  emit('sizeChange', size)
  emit('pageChange', 1)
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  emit('pageChange', page)
}
</script>

<style lang="scss" scoped>
.enhanced-table {
  font-size: 12px;

  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-button) {
    font-size: 12px;
  }

  :deep(.el-input__inner) {
    font-size: 12px;
  }

  :deep(.el-select .el-input__inner) {
    font-size: 12px;
  }

  :deep(.el-pagination) {
    font-size: 12px;
  }

  .search-bar {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-size: 12px;

    .search-form {
      margin: 0;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      gap: 10px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

