<script setup lang="ts">
defineEmits<{ close: [] }>()
const props = defineProps<{
  title?: string
  open?: boolean
  medium?: boolean
  sticky?: boolean
  loading?: boolean
}>()
useScrollLock(computed(() => props.open))
</script>
<template>
  <section
    v-if="open"
    :open="open"
    :class="[
      'fixed inset-0 z-40 flex items-center justify-center p-4 bg-gray-500/50 backdrop-blur-xs',
    ]"
    @click="$emit('close')"
  >
    <div
      :class="[
        'relative w-full max-h-[calc(100dvh-2.5rem)] p-4',
        'bg-white shadow-md overflow-y-auto',
        {
          'max-w-3xl': medium,
          'max-w-md': !medium,
        },
      ]"
      @click.stop
    >
      <div
        :class="[
          'flex items-center justify-between mb-4',
          { 'sticky top-0 z-1': sticky },
        ]"
      >
        <p v-if="title" class="font-bold">{{ $t(title) }}</p>
        <Action
          class="ml-auto -mr-1 -my-1 p-1 bg-white rounded-full relative z-1"
          icon="ic:outline-close"
          :title="$t('global.close')"
          @click="$emit('close')"
        />
      </div>
      <slot />
    </div>
    <Spinner :loading="loading" />
  </section>
</template>
