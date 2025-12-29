<template>
  <div class="rich-text-editor">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: string
  height?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '400px',
  placeholder: '请输入内容...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const editorRef = ref<HTMLElement>()
let editorInstance: any = null

// 简单的富文本编辑器实现（基于 contenteditable）
const initEditor = () => {
  if (!editorRef.value) return

  const editor = editorRef.value
  editor.contentEditable = !props.disabled ? 'true' : 'false'
  editor.innerHTML = props.modelValue || ''

  // 监听输入
  editor.addEventListener('input', () => {
    const content = editor.innerHTML
    emit('update:modelValue', content)
    emit('change', content)
  })

  // 监听粘贴，清理格式
  editor.addEventListener('paste', (e) => {
    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') || ''
    document.execCommand('insertText', false, text)
  })

  editorInstance = editor
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance && editorInstance.innerHTML !== newValue) {
      editorInstance.innerHTML = newValue || ''
    }
  }
)

// 监听 disabled 变化
watch(
  () => props.disabled,
  (newDisabled) => {
    if (editorInstance) {
      editorInstance.contentEditable = newDisabled ? 'false' : 'true'
    }
  }
)

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.removeEventListener('input', () => {})
    editorInstance.removeEventListener('paste', () => {})
  }
})

// 暴露方法
defineExpose({
  getContent: () => {
    return editorInstance?.innerHTML || ''
  },
  setContent: (content: string) => {
    if (editorInstance) {
      editorInstance.innerHTML = content
      emit('update:modelValue', content)
      emit('change', content)
    }
  },
  clear: () => {
    if (editorInstance) {
      editorInstance.innerHTML = ''
      emit('update:modelValue', '')
      emit('change', '')
    }
  }
})
</script>

<style lang="scss" scoped>
.rich-text-editor {
  .editor-container {
    min-height: v-bind(height);
    padding: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    outline: none;
    background-color: #fff;
    overflow-y: auto;

    &:focus {
      border-color: var(--el-color-primary);
    }

    &:empty::before {
      content: attr(data-placeholder);
      color: var(--el-text-color-placeholder);
    }

    // 基础样式
    :deep(p) {
      margin: 0 0 8px 0;
    }

    :deep(ul),
    :deep(ol) {
      margin: 8px 0;
      padding-left: 24px;
    }

    :deep(strong) {
      font-weight: bold;
    }

    :deep(em) {
      font-style: italic;
    }

    :deep(u) {
      text-decoration: underline;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>

