<script setup lang="ts">
defineEmits<{ close: [] }>()
defineProps<{ title?: string; open?: boolean; loading?: boolean }>()
</script>
<template>
  <section
    v-if="open"
    :open="open"
    :class="[
      'fixed inset-0 z-40 flex items-center justify-center bg-gray-500/50 backdrop-blur-xs',
    ]"
  >
    <div
      :class="[
        'relative w-full max-w-md max-h-[calc(100dvh-2.5rem)] m-5 p-5',
        'rounded-2xl bg-white shadow-md text-black overflow-y-auto',
      ]"
    >
      <div class="flex items-center justify-between mb-4">
        <p v-if="title" class="font-bold">{{ title }}</p>
        <Action
          class="ml-auto"
          icon="ic:outline-close"
          title="Close"
          @click="$emit('close')"
        />
      </div>
      <slot />
    </div>
    <Spinner :loading="loading" />
  </section>
</template>
