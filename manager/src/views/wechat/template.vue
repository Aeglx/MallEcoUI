<template>
  <div class="template-page">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="模板名称">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入模板名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="模板ID">
          <el-input
            v-model="searchForm.templateId"
            placeholder="请输入模板ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
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

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>模板消息列表</span>
          <div>
            <el-button type="success" @click="handleSyncTemplates">
              <el-icon><Refresh /></el-icon>
              同步公众号模板
            </el-button>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出模板
            </el-button>
            <el-upload
              :action="''"
              :auto-upload="false"
              :on-change="handleImportFile"
              :show-file-list="false"
              accept=".xlsx,.xls"
              style="display: inline-block; margin-left: 10px"
            >
              <el-button type="warning">
                <el-icon><Upload /></el-icon>
                导入模板
              </el-button>
            </el-upload>
            <el-button type="primary" @click="handleSendMessage">
              <el-icon><Message /></el-icon>
              发送消息
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="templateId" label="模板ID" width="200" />
        <el-table-column prop="title" label="模板标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'warning' : 'success'">
              {{ row.type === 1 ? '营销' : '通知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sendCount" label="发送次数" width="120" />
        <el-table-column prop="clickCount" label="点击次数" width="120" />
        <el-table-column prop="clickRate" label="点击率" width="100">
          <template #default="{ row }">
            {{ row.clickRate ? `${row.clickRate}%` : '0%' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleSendSingle(row)">发送</el-button>
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

    <!-- 发送消息对话框 -->
    <el-dialog
      v-model="sendDialogVisible"
      title="发送模板消息"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="sendFormRef" :model="sendForm" :rules="sendFormRules" label-width="120px">
        <el-form-item label="选择模板" prop="templateId">
          <el-select v-model="sendForm.templateId" placeholder="请选择模板" style="width: 100%">
            <el-option
              v-for="template in templateOptions"
              :key="template.id"
              :label="template.title"
              :value="template.templateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送方式" prop="sendType">
          <el-radio-group v-model="sendForm.sendType">
            <el-radio label="single">单个用户</el-radio>
            <el-radio label="batch">批量发送（Excel）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="sendForm.sendType === 'single'" label="用户OpenID" prop="openid">
          <el-input v-model="sendForm.openid" placeholder="请输入用户OpenID" />
        </el-form-item>
        <el-form-item v-if="sendForm.sendType === 'batch'" label="上传Excel">
          <el-upload
            :action="''"
            :auto-upload="false"
            :on-change="handleSendFileChange"
            :file-list="sendFileList"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">Excel格式：第一列为OpenID，后续列为模板参数值</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="模板参数" prop="data">
          <div v-for="(param, index) in templateParams" :key="index" style="margin-bottom: 10px">
            <el-input
              v-model="sendForm.data[param.key]"
              :placeholder="`请输入${param.name}的值`"
              style="width: 100%"
            />
          </div>
          <el-alert v-if="templateParams.length === 0" type="info" :closable="false">
            请先选择模板
          </el-alert>
        </el-form-item>
        <el-form-item label="跳转链接（可选）">
          <el-input v-model="sendForm.url" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="小程序（可选）">
          <el-input v-model="sendForm.miniprogram.appid" placeholder="小程序AppID" style="margin-bottom: 10px" />
          <el-input v-model="sendForm.miniprogram.pagepath" placeholder="小程序页面路径" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sendDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="sendLoading" @click="handleConfirmSend">确定发送</el-button>
      </template>
    </el-dialog>

    <!-- 查看模板详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="模板详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="模板ID">{{ viewData.templateId }}</el-descriptions-item>
        <el-descriptions-item label="模板标题">{{ viewData.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ viewData.category || '-' }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag :type="viewData.type === 1 ? 'warning' : 'success'">
            {{ viewData.type === 1 ? '营销' : '通知' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="viewData.status === 1 ? 'success' : 'info'">
            {{ viewData.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送次数">{{ viewData.sendCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="点击次数">{{ viewData.clickCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="点击率">{{ viewData.clickRate ? `${viewData.clickRate}%` : '0%' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ viewData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="模板内容" :span="2">
          <div style="white-space: pre-wrap; max-height: 300px; overflow-y: auto">{{ viewData.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item v-if="viewData.example" label="模板示例" :span="2">
          <div style="white-space: pre-wrap">{{ viewData.example }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download, Upload, Message } from '@element-plus/icons-vue'
import {
  getWechatTemplateList,
  syncWechatTemplatesFromWechat,
  sendTemplateMessage,
  batchSendTemplateMessage,
  importTemplates,
  exportTemplates,
  getWechatTemplateDetail,
  updateWechatTemplate,
  deleteWechatTemplate
} from '@/api/wechat'
import type { UploadFile } from 'element-plus'

const searchForm = reactive({
  title: '',
  templateId: '',
  status: undefined as number | undefined,
  pageNumber: 1,
  pageSize: 20
})

const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 发送消息相关
const sendDialogVisible = ref(false)
const sendLoading = ref(false)
const sendFormRef = ref()
const sendForm = reactive({
  templateId: '',
  sendType: 'single',
  openid: '',
  data: {} as Record<string, any>,
  url: '',
  miniprogram: {
    appid: '',
    pagepath: ''
  }
})
const sendFormRules = {
  templateId: [{ required: true, message: '请选择模板', trigger: 'change' }],
  openid: [
    {
      required: true,
      validator: (_rule: any, value: any, callback: any) => {
        if (sendForm.sendType === 'single' && !value) {
          callback(new Error('请输入用户OpenID'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const templateOptions = ref<any[]>([])
const templateParams = ref<any[]>([])
const sendFileList = ref<UploadFile[]>([])

// 查看详情相关
const viewDialogVisible = ref(false)
const viewData = ref<any>({})

// 获取数据
const getData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await getWechatTemplateList(params)
    if (res?.success) {
      const result = res.result || res.data
      tableData.value = result?.records || result?.list || result || []
      pagination.total = result?.total || 0
      // 同时更新模板选项
      templateOptions.value = tableData.value
    }
  } catch (error) {
    console.error('获取模板列表失败:', error)
    ElMessage.error('获取模板列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  searchForm.pageNumber = 1
  getData()
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.templateId = ''
  searchForm.status = undefined
  handleSearch()
}

// 分页
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

// 选择改变
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 同步公众号模板
const handleSyncTemplates = async () => {
  try {
    await ElMessageBox.confirm('确定要从公众号同步模板吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const res: any = await syncWechatTemplatesFromWechat()
    if (res?.success) {
      ElMessage.success('同步成功')
      getData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('同步模板失败:', error)
      ElMessage.error('同步模板失败')
    }
  } finally {
    loading.value = false
  }
}

// 导出模板
const handleExport = async () => {
  try {
    loading.value = true
    const res = await exportTemplates(searchForm)
    // 创建 blob 并下载
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `模板列表_${new Date().getTime()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

// 导入模板
const handleImportFile = async (file: UploadFile) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw as File)
    loading.value = true
    const res = await importTemplates(formData)
    if (res.data?.success) {
      ElMessage.success('导入成功')
      getData()
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    loading.value = false
  }
}

// 发送消息
const handleSendMessage = () => {
  sendForm.templateId = ''
  sendForm.sendType = 'single'
  sendForm.openid = ''
  sendForm.data = {}
  sendForm.url = ''
  sendForm.miniprogram = { appid: '', pagepath: '' }
  sendFileList.value = []
  templateParams.value = []
  sendDialogVisible.value = true
}

// 监听模板选择变化
watch(
  () => sendForm.templateId,
  async (templateId) => {
    if (templateId) {
      const template = templateOptions.value.find((t) => t.templateId === templateId)
      if (template) {
        // 解析模板参数
        templateParams.value = template.params || []
        // 初始化表单数据
        templateParams.value.forEach((param: any) => {
          sendForm.data[param.key] = ''
        })
      }
    } else {
      templateParams.value = []
      sendForm.data = {}
    }
  }
)

// 发送文件变化
const handleSendFileChange = (file: UploadFile) => {
  sendFileList.value = [file]
}

// 确认发送
const handleConfirmSend = async () => {
  try {
    await sendFormRef.value?.validate()
    sendLoading.value = true

    if (sendForm.sendType === 'single') {
      // 单个发送
      const params = {
        templateId: sendForm.templateId,
        openid: sendForm.openid,
        data: sendForm.data,
        url: sendForm.url || undefined,
        miniprogram:
          sendForm.miniprogram.appid && sendForm.miniprogram.pagepath
            ? sendForm.miniprogram
            : undefined
      }
      const res: any = await sendTemplateMessage(params)
      if (res?.success) {
        ElMessage.success('发送成功')
        sendDialogVisible.value = false
        getData()
      }
    } else {
      // 批量发送
      if (sendFileList.value.length === 0) {
        ElMessage.warning('请先上传Excel文件')
        return
      }
      const formData = new FormData()
      formData.append('file', sendFileList.value[0].raw as File)
      formData.append('templateId', sendForm.templateId)
      formData.append('data', JSON.stringify(sendForm.data))
      if (sendForm.url) formData.append('url', sendForm.url)
      if (sendForm.miniprogram.appid) {
        formData.append('miniprogram', JSON.stringify(sendForm.miniprogram))
      }

      const res: any = await batchSendTemplateMessage(formData)
      if (res?.success) {
        ElMessage.success('批量发送成功')
        sendDialogVisible.value = false
        getData()
      }
    }
  } catch (error: any) {
    if (error !== false) {
      console.error('发送失败:', error)
      ElMessage.error('发送失败')
    }
  } finally {
    sendLoading.value = false
  }
}

// 单个发送
const handleSendSingle = (row: any) => {
  sendForm.templateId = row.templateId
  sendForm.sendType = 'single'
  sendForm.openid = ''
  sendForm.data = {}
  sendForm.url = row.url || ''
  sendForm.miniprogram = {
    appid: row.miniprogramAppid || '',
    pagepath: row.miniprogramPath || ''
  }
  sendFileList.value = []
  templateParams.value = row.params || []
  sendDialogVisible.value = true
}

// 查看详情
const handleView = async (row: any) => {
  try {
    loading.value = true
    const res: any = await getWechatTemplateDetail(row.id)
    if (res?.success) {
      viewData.value = res.result || res.data || row
      viewDialogVisible.value = true
    }
  } catch (error) {
    console.error('获取模板详情失败:', error)
    ElMessage.error('获取模板详情失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = (_row: any) => {
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能待实现')
}

// 状态改变
const handleStatusChange = async (row: any) => {
  try {
    const res: any = await updateWechatTemplate(row.id, { status: row.status })
    if (res?.success) {
      ElMessage.success('状态更新成功')
    } else {
      // 回滚状态
      row.status = row.status === 1 ? 0 : 1
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新状态失败')
    // 回滚状态
    row.status = row.status === 1 ? 0 : 1
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除此模板？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res: any = await deleteWechatTemplate(row.id)
    if (res?.success) {
      ElMessage.success('删除成功')
      getData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss">
.template-page {
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
