<script setup lang="ts">
defineProps<{
  title?: string | null
  loading?: boolean
}>()
</script>
<template>
  <div>
    <div
      :class="[
        'mb-8',
        {
          'grid gap-6 md:grid-cols-[1fr_auto_1fr] md:before:block':
            $slots['actions'],
        },
      ]"
    >
      <h1
        v-if="title"
        class="text-center text-2xl font-serif font-bold tracking-wide"
      >
        {{ title }}
      </h1>
      <div
        v-if="$slots['actions']"
        class="flex gap-2 items-center justify-center md:justify-end"
      >
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="$slots['grid']"
      id="grid"
      class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-4 gap-y-8"
    >
      <slot name="grid" />
    </div>
    <slot />
    <Spinner :loading="loading" />
  </div>
</template>
