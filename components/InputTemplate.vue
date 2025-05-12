<script lang="ts" setup>
import type { InputTemplate } from '~/types'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<InputTemplate>()

const inputClassName = computed(() => [
  'group relative px-3 py-[0.6875rem] flex items-center gap-3 border rounded-lg transition-colors',
  {
    'bg-white border-black/30 focus-within:border-black/70':
      !props.error && !props.disabled,
    'bg-error/10 border-error': props.error,
    'bg-black/10 border-black/30 cursor-default': props.disabled,
    'md:max-w-[18.75rem]': props.inputSize === 'medium',
    'max-w-[13.5rem]': props.inputSize === 'small',
    'max-w-[10.5rem]': props.inputSize === 'tiny',
  },
])
</script>

<template>
  <div :class="$attrs.class">
    <label v-if="label" class="block mb-2 font-bold text-md/4" :for="fieldId">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    <slot name="content-input" :class-name="inputClassName" />
    <div
      v-if="error && errorMessage"
      class="mt-2 font-bold text-md/4 text-error"
    >
      {{ errorMessage }}
    </div>
    <div v-if="caption" class="mt-2 font-bold text-md/4 text-black/60">
      {{ caption }}
    </div>
    <slot />
  </div>
</template>
