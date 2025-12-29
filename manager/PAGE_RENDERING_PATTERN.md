# 页面渲染模式说明文档

## 一、渲染模式总结

### 1. 后端数据提供方式
- 后端通过 RESTful API 提供数据
- 统一的响应格式：`{ success: boolean, result: any, message: string }`
- 列表接口支持分页：`{ page: number, pageSize: number, ...searchParams }`
- 列表响应格式：`{ records: T[], total: number }` 或 `{ data: T[], total: number }`

### 2. 前端渲染方式
- **统一使用 `enhanced-table` 组件**进行列表页面渲染
- 每个列表页面都遵循相同的模式：
  1. 搜索表单（可选）
  2. 工具栏（新增、批量操作等）
  3. 数据表格
  4. 分页组件

### 3. 标准页面结构

```vue
<template>
  <div class="xxx-list">
    <enhanced-table
      :data="tableData"
      :loading="loading"
      :show-search="true"
      :search-items="searchItems"
      :show-toolbar="true"
      :show-selection="true"
      :show-index="true"
      :show-pagination="true"
      :page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @search="handleSearch"
      @reset="handleReset"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <!-- 工具栏插槽 -->
      <template #toolbar-left>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>

      <!-- 表格列定义 -->
      <el-table-column prop="name" label="名称" />
      <!-- ...更多列 -->
    </enhanced-table>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <!-- 表单内容 -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 1. 导入依赖
import { ref, reactive, onMounted } from 'vue'
import EnhancedTable from '@/components/malleco/enhanced-table.vue'
import { getXxxList, addXxx, updateXxx, deleteXxx } from '@/api/xxx'

// 2. 定义响应式数据
const tableData = ref([])
const loading = ref(false)
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const searchForm = reactive({ /* 搜索字段 */ })

// 3. 定义搜索项配置
const searchItems = [/* ... */]

// 4. 数据获取函数
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getXxxList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    if (res.success) {
      tableData.value = res.result?.records || []
      pagination.total = res.result?.total || 0
    }
  } finally {
    loading.value = false
  }
}

// 5. 事件处理函数
const handleSearch = (form) => { /* ... */ }
const handleAdd = () => { /* ... */ }
const handleEdit = (row) => { /* ... */ }
const handleDelete = (row) => { /* ... */ }

// 6. 生命周期
onMounted(() => {
  fetchList()
})
</script>
```

## 二、已完成的页面

### 1. 商品管理
- ✅ `goods-list.vue` - 商品列表
- ✅ `goods-detail.vue` - 商品详情
- ✅ `goods-edit.vue` - 商品编辑
- ✅ `brand-list.vue` - 品牌列表（新增）
- ✅ `category-list.vue` - 分类列表（新增，树形结构）

### 2. 会员管理
- ✅ `member-list.vue` - 会员列表
- ✅ `member-detail.vue` - 会员详情
- ✅ `member-edit.vue` - 会员编辑

### 3. 订单管理
- ✅ `order-list.vue` - 订单列表
- ✅ `order-detail.vue` - 订单详情

### 4. 促销活动
- ✅ `promotion-list.vue` - 促销活动列表
- ✅ `promotion-detail.vue` - 促销活动详情
- ✅ `promotion-edit.vue` - 促销活动编辑

### 5. 系统设置
- ✅ `system-setting.vue` - 系统设置

## 三、待开发的页面（参考旧项目结构）

### 1. 商品管理扩展
- [ ] `spec-list.vue` - 规格管理
- [ ] `parameter-list.vue` - 参数管理
- [ ] `goods-review.vue` - 商品审核

### 2. 会员管理扩展
- [ ] `member-balance.vue` - 会员余额管理
- [ ] `member-points.vue` - 会员积分管理
- [ ] `member-wallet.vue` - 钱包日志
- [ ] `member-message.vue` - 会员消息管理

### 3. 订单管理扩展
- [ ] `after-sale-list.vue` - 售后订单列表
- [ ] `after-sale-detail.vue` - 售后订单详情
- [ ] `refund-log.vue` - 退款日志
- [ ] `payment-log.vue` - 支付日志

### 4. 促销活动详细页面
- [ ] `coupon-list.vue` - 优惠券列表
- [ ] `coupon-activity-list.vue` - 优惠券活动列表
- [ ] `seckill-list.vue` - 秒杀活动列表
- [ ] `pintuan-list.vue` - 拼团活动列表
- [ ] `kanjia-list.vue` - 砍价活动列表
- [ ] `full-discount-list.vue` - 满减活动列表

### 5. 系统管理
- [ ] `log-list.vue` - 系统日志
- [ ] `role-list.vue` - 角色管理
- [ ] `permission-list.vue` - 权限管理
- [ ] `department-list.vue` - 部门管理
- [ ] `user-list.vue` - 用户管理

### 6. 其他功能
- [ ] `logistics-list.vue` - 物流管理
- [ ] `statistics-goods.vue` - 商品统计
- [ ] `statistics-member.vue` - 会员统计
- [ ] `statistics-order.vue` - 订单统计
- [ ] `statistics-traffic.vue` - 流量统计
- [ ] `article-list.vue` - 文章管理
- [ ] `feedback-list.vue` - 反馈管理

## 四、API 接口规范

### API 路径规范
- 商品管理：`/manager/goods/*`
- 品牌管理：`/manager/goods/brand`
- 分类管理：`/manager/goods/category`
- 会员管理：`/member/*`
- 订单管理：`/order/*`

### 标准 CRUD 接口
- `GET /xxx` - 获取列表（支持分页和搜索）
- `GET /xxx/:id` - 获取详情
- `POST /xxx` - 新增
- `PUT /xxx/:id` 或 `PATCH /xxx/:id` - 更新
- `DELETE /xxx/:ids` - 删除（支持批量，ids用逗号分隔）

## 五、开发步骤

对于每个新页面，按以下步骤开发：

1. **添加 API 接口**（在对应的 `api/*.ts` 文件中）
   ```typescript
   export const getXxxList = (params?: any) => {
     return getRequest('/manager/xxx', params)
   }
   ```

2. **创建页面组件**（在 `views/xxx/` 目录下）
   - 使用 `enhanced-table` 组件
   - 遵循标准的页面结构
   - 实现 CRUD 操作

3. **添加路由**（在 `router/routes.ts` 中）
   ```typescript
   {
     path: 'xxx-list',
     name: 'xxx-list',
     meta: { title: 'XXX列表' },
     component: () => import('@/views/xxx/xxx-list.vue')
   }
   ```

4. **测试功能**
   - 列表查询
   - 搜索筛选
   - 新增/编辑
   - 删除操作
   - 分页功能

## 六、注意事项

1. **统一的数据格式**：确保 API 返回的数据格式一致
2. **错误处理**：所有 API 调用都要有错误处理
3. **加载状态**：列表加载时要显示 loading 状态
4. **表单验证**：新增/编辑表单要有验证规则
5. **确认对话框**：删除操作要有确认提示
6. **消息提示**：操作成功/失败要有消息提示

## 七、特殊页面类型

### 树形结构页面（如分类管理）
- 使用 `el-table` 的 `tree-props` 属性
- 不适用 `enhanced-table` 组件（因为需要自定义树形展示）

### 统计页面
- 使用图表库（如 G2）
- 可能需要不同的布局

### 详情页面
- 使用 `el-descriptions` 展示详细信息
- 可能需要多个 Tab 展示不同类型的信息

