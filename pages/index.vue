<script setup lang="ts">
const { data: testData, execute: getTestData } = useLazyAsyncData(
  async () => {
    const result = await $fetch('/api/wishlist')
    return result.payload
  },
  {
    immediate: false,
    default() {
      return undefined
    },
  },
)
</script>
<template>
  <div class="overflow-hidden">
    <button @click="getTestData()">getTestData</button>
    <pre>{{ testData }}</pre>
  </div>
</template>
