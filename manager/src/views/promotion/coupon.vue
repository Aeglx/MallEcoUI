<template>
  <div class="coupon-page">
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input
            v-model="searchForm.couponName"
            placeholder="请输入优惠券名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="获取方式">
          <el-select v-model="searchForm.getType" clearable placeholder="请选择" style="width: 200px">
            <el-option label="免费获取" value="FREE" />
            <el-option label="活动获取" value="ACTIVITY" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="searchForm.promotionStatus" clearable placeholder="请选择" style="width: 200px">
            <el-option label="未开始" value="NEW" />
            <el-option label="已开始" value="START" />
            <el-option label="已结束" value="END" />
            <el-option label="已关闭" value="CLOSE" />
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
          <span>优惠券列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加优惠券
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
        <el-table-column prop="couponName" label="优惠券名称" min-width="180" />
        <el-table-column label="面额/折扣" width="150">
          <template #default="{ row }">
            <span v-if="row.price">¥{{ row.price }}</span>
            <span v-else>{{ row.couponDiscount }}折</span>
          </template>
        </el-table-column>
        <el-table-column label="已领取/总数量" width="180">
          <template #default="{ row }">
            {{ row.receivedNum || 0 }}/{{ row.publishNum === 0 ? '不限制' : row.publishNum }}
          </template>
        </el-table-column>
        <el-table-column label="已使用/已领取" width="150">
          <template #default="{ row }">
            {{ row.usedNum || 0 }}/{{ row.receivedNum || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="getType" label="获取方式" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.getType === 'FREE'" type="danger">免费获取</el-tag>
            <el-tag v-else-if="row.getType === 'ACTIVITY'" type="warning">活动获取</el-tag>
            <el-tag v-else>其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="couponType" label="优惠券类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.couponType === 'DISCOUNT'" type="primary">打折</el-tag>
            <el-tag v-else type="success">减免现金</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="promotionStatus" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.promotionStatus === 'START'" type="success">已开始</el-tag>
            <el-tag v-else-if="row.promotionStatus === 'NEW'" type="info">未开始</el-tag>
            <el-tag v-else-if="row.promotionStatus === 'END'" type="warning">已结束</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="活动名称" prop="promotionName">
          <el-input v-model="formData.promotionName" placeholder="请输入活动名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="formData.couponName" placeholder="请输入优惠券名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="优惠券类型" prop="couponType">
          <el-radio-group v-model="formData.couponType">
            <el-radio label="DISCOUNT">打折</el-radio>
            <el-radio label="PRICE">减免现金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.couponType === 'DISCOUNT'" label="折扣" prop="couponDiscount">
          <el-input-number
            v-model="formData.couponDiscount"
            :min="0.1"
            :max="9.9"
            :precision="1"
            :step="0.1"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">请输入0.1-9.9的数字，可有一位小数</span>
        </el-form-item>
        <el-form-item v-if="formData.couponType === 'PRICE'" label="面额" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0.01"
            :precision="2"
            :step="10"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">元</span>
        </el-form-item>
        <el-form-item label="获取方式" prop="getType">
          <el-radio-group v-model="formData.getType">
            <el-radio label="FREE">免费获取</el-radio>
            <el-radio label="ACTIVITY">活动获取</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发行数量" prop="publishNum">
          <el-input-number
            v-model="formData.publishNum"
            :min="0"
            :step="100"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #999">0表示不限制</span>
        </el-form-item>
        <el-form-item label="限领数量" prop="couponLimitNum">
          <el-input-number
            v-model="formData.couponLimitNum"
            :min="1"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="formData.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="有效期类型" prop="rangeDayType">
          <el-radio-group v-model="formData.rangeDayType">
            <el-radio label="FIXED">固定天数</el-radio>
            <el-radio label="PERIOD">时间段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.rangeDayType === 'FIXED'" label="有效天数" prop="effectiveDays">
          <el-input-number v-model="formData.effectiveDays" :min="1" style="width: 200px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="优惠券详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="优惠券名称">{{ detailData.couponName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="活动名称">{{ detailData.promotionName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优惠券类型">
          <el-tag v-if="detailData.couponType === 'DISCOUNT'" type="primary">打折</el-tag>
          <el-tag v-else type="success">减免现金</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="面额/折扣">
          <span v-if="detailData.price">¥{{ detailData.price }}</span>
          <span v-else>{{ detailData.couponDiscount }}折</span>
        </el-descriptions-item>
        <el-descriptions-item label="获取方式">
          <el-tag v-if="detailData.getType === 'FREE'" type="danger">免费获取</el-tag>
          <el-tag v-else type="warning">活动获取</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发行数量">
          {{ detailData.publishNum === 0 ? '不限制' : detailData.publishNum }}
        </el-descriptions-item>
        <el-descriptions-item label="已领取">{{ detailData.receivedNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="已使用">{{ detailData.usedNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detailData.promotionStatus === 'START'" type="success">已开始</el-tag>
          <el-tag v-else-if="detailData.promotionStatus === 'NEW'" type="info">未开始</el-tag>
          <el-tag v-else-if="detailData.promotionStatus === 'END'" type="warning">已结束</el-tag>
          <el-tag v-else type="danger">已关闭</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getCouponList, getCouponDetail, addCoupon, updateCoupon, deleteCoupon } from '@/api/promotion'

const searchForm = reactive({
  couponName: '',
  getType: '',
  promotionStatus: '',
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
  searchForm.couponName = ''
  searchForm.getType = ''
  searchForm.promotionStatus = ''
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
    const res = await getCouponList(params)
    if (res.success) {
      tableData.value = res.result?.records || res.result?.list || res.result || []
      pagination.total = res.result?.total || 0
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
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
const dialogTitle = ref('添加优惠券')
const formRef = ref()
const formData = reactive({
  id: '',
  promotionName: '',
  couponName: '',
  couponType: 'PRICE',
  couponDiscount: 0,
  price: 0,
  getType: 'FREE',
  publishNum: 0,
  couponLimitNum: 1,
  dateRange: [],
  rangeDayType: 'FIXED',
  effectiveDays: 1
})

const formRules = {
  promotionName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  couponType: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  couponDiscount: [
    {
      validator: (rule: any, value: number, callback: any) => {
        if (formData.couponType === 'DISCOUNT' && (!value || value < 0.1 || value > 9.9)) {
          callback(new Error('折扣必须在0.1-9.9之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  price: [
    {
      validator: (rule: any, value: number, callback: any) => {
        if (formData.couponType === 'PRICE' && (!value || value <= 0)) {
          callback(new Error('面额必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听优惠券类型变化，重置相关字段
watch(
  () => formData.couponType,
  () => {
    if (formData.couponType === 'DISCOUNT') {
      formData.price = 0
    } else {
      formData.couponDiscount = 0
    }
    if (formRef.value) {
      formRef.value.clearValidate(['couponDiscount', 'price'])
    }
  }
)

const handleAdd = () => {
  dialogTitle.value = '添加优惠券'
  formData.id = ''
  formData.promotionName = ''
  formData.couponName = ''
  formData.couponType = 'PRICE'
  formData.couponDiscount = 0
  formData.price = 0
  formData.getType = 'FREE'
  formData.publishNum = 0
  formData.couponLimitNum = 1
  formData.dateRange = []
  formData.rangeDayType = 'FIXED'
  formData.effectiveDays = 1
  dialogVisible.value = true
}

const handleView = (row: any) => {
  Object.assign(detailData, {
    couponName: row.couponName || '',
    promotionName: row.promotionName || '',
    couponType: row.couponType || '',
    price: row.price || 0,
    couponDiscount: row.couponDiscount || 0,
    getType: row.getType || '',
    publishNum: row.publishNum || 0,
    receivedNum: row.receivedNum || 0,
    usedNum: row.usedNum || 0,
    promotionStatus: row.promotionStatus || '',
    createTime: row.createTime || ''
  })
  viewDialogVisible.value = true
}

const handleEdit = async (row: any) => {
  try {
    const res = await getCouponDetail(row.id.toString())
    if (res.success && res.result) {
      dialogTitle.value = '编辑优惠券'
      formData.id = res.result.id
      formData.promotionName = res.result.promotionName || ''
      formData.couponName = res.result.couponName || ''
      formData.couponType = res.result.couponType || 'PRICE'
      formData.couponDiscount = res.result.couponDiscount || 0
      formData.price = res.result.price || 0
      formData.getType = res.result.getType || 'FREE'
      formData.publishNum = res.result.publishNum || 0
      formData.couponLimitNum = res.result.couponLimitNum || 1
      if (res.result.startTime && res.result.endTime) {
        formData.dateRange = [res.result.startTime, res.result.endTime]
      } else {
        formData.dateRange = []
      }
      formData.rangeDayType = res.result.rangeDayType || 'FIXED'
      formData.effectiveDays = res.result.effectiveDays || 1
      dialogVisible.value = true
    }
  } catch (error) {
    // 如果获取详情失败，使用行数据
    dialogTitle.value = '编辑优惠券'
    formData.id = row.id
    formData.promotionName = row.promotionName || ''
    formData.couponName = row.couponName || ''
    formData.couponType = row.couponType || 'PRICE'
    formData.couponDiscount = row.couponDiscount || 0
    formData.price = row.price || 0
    formData.getType = row.getType || 'FREE'
    formData.publishNum = row.publishNum || 0
    formData.couponLimitNum = row.couponLimitNum || 1
    formData.dateRange = []
    formData.rangeDayType = row.rangeDayType || 'FIXED'
    formData.effectiveDays = row.effectiveDays || 1
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params: any = { ...formData }
        if (formData.dateRange && formData.dateRange.length === 2) {
          params.startTime = formData.dateRange[0]
          params.endTime = formData.dateRange[1]
        }
        delete params.dateRange
        delete params.id

        let res
        if (formData.id) {
          res = await updateCoupon(formData.id.toString(), params)
        } else {
          res = await addCoupon(params)
        }
        if (res.success) {
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

// 查看详情对话框
const viewDialogVisible = ref(false)
const detailData = reactive({
  couponName: '',
  promotionName: '',
  couponType: '',
  price: 0,
  couponDiscount: 0,
  getType: '',
  publishNum: 0,
  receivedNum: 0,
  usedNum: 0,
  promotionStatus: '',
  createTime: ''
})

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此优惠券？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteCoupon(row.id)
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
.coupon-page {
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

