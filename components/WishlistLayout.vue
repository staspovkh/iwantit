<script setup lang="ts">
defineProps<{
  title?: string | null
  loading?: boolean
}>()
</script>
<template>
  <div>
    <h1 v-if="title" class="text-center text-2xl font-bold mb-8">
      {{ title }}
    </h1>
    <div v-if="$slots['actions']" class="flex gap-2 justify-end mb-2">
      <slot name="actions" />
    </div>
    <slot />
    <Spinner :loading="loading" />
  </div>
</template>
