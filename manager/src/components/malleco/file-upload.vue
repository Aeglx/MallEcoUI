<template>
  <div class="file-upload">
    <el-upload
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      :file-list="fileList"
      :limit="limit"
      :multiple="multiple"
      :accept="accept"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :disabled="disabled"
      :show-file-list="showFileList"
      class="file-uploader"
    >
      <el-button type="primary" :disabled="disabled">
        <el-icon><Upload /></el-icon>
        {{ buttonText }}
      </el-button>
      <template #tip>
        <div v-if="tip" class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/index'
import { getToken } from '@/libs/util'
import type { UploadFile, UploadProps } from 'element-plus'

interface Props {
  modelValue: string | string[]
  limit?: number
  multiple?: boolean
  accept?: string
  disabled?: boolean
  showFileList?: boolean
  buttonText?: string
  tip?: string
  maxSize?: number // MB
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5,
  multiple: false,
  accept: '*',
  disabled: false,
  showFileList: true,
  buttonText: '点击上传',
  maxSize: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  'change': [value: string | string[]]
}>()

const uploadUrl = uploadFile
const uploadHeaders = computed(() => ({
  'mall-token': getToken() || ''
}))

const uploadData = ref({})

const fileList = ref<UploadFile[]>([])

// 将 modelValue 转换为 fileList
const initFileList = () => {
  if (!props.modelValue) {
    fileList.value = []
    return
  }

  const values = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  fileList.value = values
    .filter((url) => url)
    .map((url, index) => {
      const fileName = url.split('/').pop() || `file-${index}`
      return {
        uid: `file-${index}`,
        name: fileName,
        url: url,
        status: 'success' as const
      }
    })
}

// 初始化
initFileList()

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  () => {
    initFileList()
  },
  { deep: true }
)

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize

  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB!`)
    return false
  }
  return true
}

const handleSuccess: UploadProps['onSuccess'] = (response: any, file: UploadFile) => {
  if (response && response.result) {
    const fileUrl = response.result
    let newValue: string | string[]

    if (props.multiple) {
      const currentValues = Array.isArray(props.modelValue) ? props.modelValue : []
      newValue = [...currentValues, fileUrl]
    } else {
      newValue = fileUrl
    }

    emit('update:modelValue', newValue)
    emit('change', newValue)
    ElMessage.success('上传成功!')
  } else {
    ElMessage.error('上传失败，请重试!')
  }
}

const handleError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败，请重试!')
}

const handleRemove: UploadProps['onRemove'] = (file: UploadFile) => {
  let newValue: string | string[]

  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? props.modelValue : []
    const fileUrl = file.url || ''
    newValue = currentValues.filter((url) => url !== fileUrl)
  } else {
    newValue = ''
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件!`)
}
</script>

<style lang="scss" scoped>
.file-upload {
  .file-uploader {
    :deep(.el-upload-list) {
      margin-top: 10px;
    }
  }

  .el-upload__tip {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>

