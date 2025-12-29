<template>
  <div class="goods-order-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderSn"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="会员名称">
          <el-input
            v-model="searchForm.memberName"
            placeholder="请输入会员名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待付款" value="UNPAID" />
            <el-option label="待发货" value="UNSHIPPED" />
            <el-option label="待收货" value="SHIPPED" />
            <el-option label="已完成" value="COMPLETED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
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
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        font-size="12px"
      >
        <el-table-column prop="id" label="订单ID" width="120" />
        <el-table-column prop="orderSn" label="订单号" width="180" />
        <el-table-column prop="memberName" label="会员名称" min-width="120" />
        <el-table-column prop="goodsCount" label="商品数量" width="100" align="right" />
        <el-table-column prop="totalAmount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.totalAmount || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.orderStatus === 'COMPLETED'" type="success">已完成</el-tag>
            <el-tag v-else-if="row.orderStatus === 'UNPAID'" type="warning">待付款</el-tag>
            <el-tag v-else-if="row.orderStatus === 'UNSHIPPED'" type="info">待发货</el-tag>
            <el-tag v-else-if="row.orderStatus === 'SHIPPED'" type="primary">待收货</el-tag>
            <el-tag v-else type="danger">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.orderStatus === 'UNSHIPPED'"
              link
              type="primary"
              size="small"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.orderStatus === 'UNPAID'"
              link
              type="warning"
              size="small"
              @click="handleCancel(row)"
            >
              取消
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

    <!-- 查看订单详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="订单详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detailData.orderSn || '-' }}</el-descriptions-item>
        <el-descriptions-item label="会员名称">{{ detailData.memberName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          <span style="color: #f56c6c; font-weight: bold">¥{{ detailData.totalAmount || '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="商品数量">{{ detailData.goodsCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag v-if="detailData.orderStatus === 'COMPLETED'" type="success">已完成</el-tag>
          <el-tag v-else-if="detailData.orderStatus === 'UNPAID'" type="warning">待付款</el-tag>
          <el-tag v-else-if="detailData.orderStatus === 'UNSHIPPED'" type="info">待发货</el-tag>
          <el-tag v-else-if="detailData.orderStatus === 'SHIPPED'" type="primary">待收货</el-tag>
          <el-tag v-else type="danger">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ detailData.payType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ detailData.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="物流公司">{{ detailData.logisticsName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ detailData.logisticsNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detailData.payTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" title="订单发货" width="600px">
      <el-form ref="shipFormRef" :model="shipForm" :rules="shipFormRules" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="shipForm.orderSn" disabled />
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-input v-model="shipForm.logisticsCompany" placeholder="请输入物流公司名称" />
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="shipForm.logisticsNo" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="shipForm.remark" type="textarea" :rows="3" placeholder="请输入备注（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleShipSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getOrderList, getOrderDetail, deleteOrder, cancelOrder, shipOrder } from '@/api/order'

const searchForm = reactive({
  orderSn: '',
  memberName: '',
  orderStatus: '',
  dateRange: [],
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
  searchForm.orderSn = ''
  searchForm.memberName = ''
  searchForm.orderStatus = ''
  searchForm.dateRange = []
  handleSearch()
}

const getData = async () => {
  loading.value = true
  try {
    const params: any = { ...searchForm, pageNumber: pagination.page, pageSize: pagination.pageSize }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    delete params.dateRange
    const res = await getOrderList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
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

// 查看详情对话框
const viewDialogVisible = ref(false)
const detailData = reactive({
  orderSn: '',
  memberName: '',
  totalAmount: '0.00',
  goodsCount: 0,
  orderStatus: '',
  payType: '',
  address: '',
  logisticsName: '',
  logisticsNo: '',
  createTime: '',
  payTime: ''
})

const handleView = async (row: any) => {
  try {
    const res = await getOrderDetail(row.id.toString())
    if (res.success && res.result) {
      Object.assign(detailData, {
        orderSn: res.result.orderSn || '',
        memberName: res.result.memberName || '',
        totalAmount: res.result.totalAmount || '0.00',
        goodsCount: res.result.goodsCount || 0,
        orderStatus: res.result.orderStatus || '',
        payType: res.result.payType || '',
        address: res.result.address || '',
        logisticsName: res.result.logisticsName || '',
        logisticsNo: res.result.logisticsNo || '',
        createTime: res.result.createTime || '',
        payTime: res.result.payTime || ''
      })
    } else {
      // 如果获取详情失败，使用行数据
      Object.assign(detailData, {
        orderSn: row.orderSn || '',
        memberName: row.memberName || '',
        totalAmount: row.totalAmount || '0.00',
        goodsCount: row.goodsCount || 0,
        orderStatus: row.orderStatus || '',
        payType: row.payType || '',
        address: row.address || '',
        logisticsName: row.logisticsName || '',
        logisticsNo: row.logisticsNo || '',
        createTime: row.createTime || '',
        payTime: row.payTime || ''
      })
    }
    viewDialogVisible.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    // 使用行数据
    Object.assign(detailData, {
      orderSn: row.orderSn || '',
      memberName: row.memberName || '',
      totalAmount: row.totalAmount || '0.00',
      goodsCount: row.goodsCount || 0,
      orderStatus: row.orderStatus || '',
      payType: row.payType || '',
      address: row.address || '',
      logisticsName: row.logisticsName || '',
      logisticsNo: row.logisticsNo || '',
      createTime: row.createTime || '',
      payTime: row.payTime || ''
    })
    viewDialogVisible.value = true
  }
}

// 发货对话框
const shipDialogVisible = ref(false)
const shipFormRef = ref()
const shipForm = reactive({
  id: '',
  orderSn: '',
  logisticsCompany: '',
  logisticsNo: '',
  remark: ''
})

const shipFormRules = {
  logisticsCompany: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
  logisticsNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
}

const handleShip = (row: any) => {
  shipForm.id = row.id
  shipForm.orderSn = row.orderSn || ''
  shipForm.logisticsCompany = ''
  shipForm.logisticsNo = ''
  shipForm.remark = ''
  shipDialogVisible.value = true
}

const handleShipSubmit = async () => {
  if (!shipFormRef.value) return
  await shipFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const res = await shipOrder(shipForm.id.toString(), {
          logisticsCompany: shipForm.logisticsCompany,
          logisticsNo: shipForm.logisticsNo,
          remark: shipForm.remark
        })
        if (res.success) {
          ElMessage.success('发货成功')
          shipDialogVisible.value = false
          getData()
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '发货失败')
      }
    }
  })
}

const handleCancel = (row: any) => {
  ElMessageBox.confirm('确认取消此订单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await cancelOrder(row.id, {})
      if (res.success) {
        ElMessage.success('取消成功')
        getData()
      }
    } catch (error) {
      console.error('取消失败:', error)
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此订单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteOrder(row.id)
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
.goods-order-page {
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
    .pagination-container {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

