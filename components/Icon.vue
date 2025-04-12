<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: string | number }>(), {
  size: 24,
})
</script>
<template>
  <NuxtIcon :name="name" :width="size" :height="size" />
</template>
