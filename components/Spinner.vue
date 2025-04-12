<script setup lang="ts">
defineProps<{ loading?: boolean }>()
</script>
<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs"
  >
    <span class="animate-spin origin-[100%_50%]">
      <Icon name="ic:outline-switch-access-shortcut" />
    </span>
  </div>
</template>
