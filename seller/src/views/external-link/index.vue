<template>
  <div class="external-link">
    <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const url = ref('')

onMounted(() => {
  url.value = (route.query.url as string) || ''
})
</script>

<style scoped lang="scss">
.external-link {
  width: 100%;
  height: 100%;
  iframe {
    border: none;
  }
}
</style>

