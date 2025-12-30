<template>
  <div class="model-form" v-if="pageData && pageData.list">
    <ModelFormItem
      v-for="(element, index) in pageData.list"
      :key="element.key || index"
      :element="element"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ModelFormItem from './ModelFormItem.vue'

defineProps<{
  pageData: {
    list: any[]
  } | null
}>()
</script>

<style lang="scss" scoped>
.model-form {
  width: 100%;
}
</style>

