<template>
  <div class="enhanced-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :inline="inline"
      :disabled="disabled"
    >
      <template v-for="item in formItems" :key="item.prop">
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          :required="item.required"
          :rules="item.rules"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :clearable="item.clearable !== false"
            :show-password="item.showPassword"
            :maxlength="item.maxlength"
            :show-word-limit="item.showWordLimit"
            :type="item.inputType || 'text'"
            @blur="handleBlur(item, $event)"
            @change="handleChange(item, $event)"
          />

          <!-- 文本域 -->
          <el-input
            v-else-if="item.type === 'textarea'"
            v-model="formData[item.prop]"
            type="textarea"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :rows="item.rows || 4"
            :maxlength="item.maxlength"
            :show-word-limit="item.showWordLimit"
            @blur="handleBlur(item, $event)"
            @change="handleChange(item, $event)"
          />

          <!-- 数字输入框 -->
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :precision="item.precision"
            :controls-position="item.controlsPosition"
            style="width: 100%"
            @blur="handleBlur(item, $event)"
            @change="handleChange(item, $event)"
          />

          <!-- 选择器 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :clearable="item.clearable !== false"
            :multiple="item.multiple"
            :filterable="item.filterable"
            :allow-create="item.allowCreate"
            style="width: 100%"
            @change="handleChange(item, $event)"
          >
            <el-option
              v-for="option in getOptions(item)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>

          <!-- 单选按钮组 -->
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            @change="handleChange(item, $event)"
          >
            <el-radio
              v-for="option in getOptions(item)"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <!-- 复选框组 -->
          <el-checkbox-group
            v-else-if="item.type === 'checkbox'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            @change="handleChange(item, $event)"
          >
            <el-checkbox
              v-for="option in getOptions(item)"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="formData[item.prop]"
            type="date"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :clearable="item.clearable !== false"
            :value-format="item.valueFormat || 'YYYY-MM-DD'"
            style="width: 100%"
            @change="handleChange(item, $event)"
          />

          <!-- 日期时间选择器 -->
          <el-date-picker
            v-else-if="item.type === 'datetime'"
            v-model="formData[item.prop]"
            type="datetime"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :clearable="item.clearable !== false"
            :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
            style="width: 100%"
            @change="handleChange(item, $event)"
          />

          <!-- 日期范围选择器 -->
          <el-date-picker
            v-else-if="item.type === 'daterange'"
            v-model="formData[item.prop]"
            type="daterange"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :disabled="item.disabled"
            :clearable="item.clearable !== false"
            :value-format="item.valueFormat || 'YYYY-MM-DD'"
            style="width: 100%"
            @change="handleChange(item, $event)"
          />

          <!-- 开关 -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop]"
            :disabled="item.disabled"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            @change="handleChange(item, $event)"
          />

          <!-- 图片上传 -->
          <image-upload
            v-else-if="item.type === 'image'"
            v-model="formData[item.prop]"
            :limit="item.limit || 1"
            :multiple="item.multiple || false"
            :list-type="item.listType || 'picture-card'"
            :disabled="item.disabled"
            @change="handleChange(item, $event)"
          />

          <!-- 文件上传 -->
          <file-upload
            v-else-if="item.type === 'file'"
            v-model="formData[item.prop]"
            :limit="item.limit || 1"
            :multiple="item.multiple || false"
            :accept="item.accept"
            :disabled="item.disabled"
            @change="handleChange(item, $event)"
          />

          <!-- 富文本编辑器 -->
          <rich-text-editor
            v-else-if="item.type === 'richtext'"
            v-model="formData[item.prop]"
            :height="item.height || '400px'"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            @change="handleChange(item, $event)"
          />

          <!-- 自定义插槽 -->
          <slot
            v-else-if="item.type === 'slot'"
            :name="item.slotName || item.prop"
            :item="item"
            :form-data="formData"
          />
        </el-form-item>
      </template>

      <!-- 表单操作按钮 -->
      <el-form-item v-if="showButtons" :label-width="labelWidth">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ submitText }}
        </el-button>
        <el-button v-if="showReset" @click="handleReset">重置</el-button>
        <el-button v-if="showCancel" @click="handleCancel">取消</el-button>
        <slot name="buttons" :form-data="formData" :form-ref="formRef" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import ImageUpload from './image-upload.vue'
import FileUpload from './file-upload.vue'
import RichTextEditor from './rich-text-editor.vue'

export interface FormItemOption {
  label: string
  value: any
  disabled?: boolean
}

export interface FormItem {
  prop: string
  label: string
  type:
    | 'input'
    | 'textarea'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'datetime'
    | 'daterange'
    | 'switch'
    | 'image'
    | 'file'
    | 'richtext'
    | 'slot'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  rules?: any[]
  // input 特有
  inputType?: string
  showPassword?: boolean
  maxlength?: number
  showWordLimit?: boolean
  // textarea 特有
  rows?: number
  // number 特有
  min?: number
  max?: number
  step?: number
  precision?: number
  controlsPosition?: 'right' | ''
  // select/radio/checkbox 特有
  options?: FormItemOption[] | (() => FormItemOption[] | Promise<FormItemOption[]>)
  multiple?: boolean
  filterable?: boolean
  allowCreate?: boolean
  // date 特有
  valueFormat?: string
  // switch 特有
  activeText?: string
  inactiveText?: string
  // upload 特有
  limit?: number
  accept?: string
  listType?: 'text' | 'picture' | 'picture-card'
  // richtext 特有
  height?: string
  // slot 特有
  slotName?: string
}

interface Props {
  modelValue: Record<string, any>
  formItems: FormItem[]
  rules?: FormRules
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
  inline?: boolean
  disabled?: boolean
  showButtons?: boolean
  showReset?: boolean
  showCancel?: boolean
  submitText?: string
  submitLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  formItems: () => [],
  rules: () => ({}),
  labelWidth: '120px',
  labelPosition: 'right',
  inline: false,
  disabled: false,
  showButtons: true,
  showReset: true,
  showCancel: false,
  submitText: '提交',
  submitLoading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'submit': [formData: Record<string, any>]
  'reset': []
  'cancel': []
  'change': [prop: string, value: any, formData: Record<string, any>]
  'blur': [prop: string, value: any, formData: Record<string, any>]
}>()

const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({ ...props.modelValue })

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    Object.keys(formData).forEach((key) => {
      delete formData[key]
    })
    Object.assign(formData, newValue)
  },
  { deep: true }
)

// 获取选项（支持函数和数组）
const getOptions = (item: FormItem): FormItemOption[] => {
  if (!item.options) return []
  if (typeof item.options === 'function') {
    // 如果是函数，返回空数组（实际使用时应该异步加载）
    return []
  }
  return item.options
}

// 处理变化
const handleChange = (item: FormItem, value: any) => {
  emit('change', item.prop, value, { ...formData })
  emit('update:modelValue', { ...formData })
}

// 处理失焦
const handleBlur = (item: FormItem, event: FocusEvent) => {
  emit('blur', item.prop, formData[item.prop], { ...formData })
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  emit('reset')
}

// 取消
const handleCancel = () => {
  emit('cancel')
}

// 验证表单
const validate = () => {
  return formRef.value?.validate()
}

// 重置表单
const resetFields = () => {
  formRef.value?.resetFields()
}

// 清除验证
const clearValidate = (props?: string | string[]) => {
  formRef.value?.clearValidate(props)
}

// 暴露方法
defineExpose({
  validate,
  resetFields,
  clearValidate,
  formRef
})
</script>

<style lang="scss" scoped>
.enhanced-form {
  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
}
</style>

