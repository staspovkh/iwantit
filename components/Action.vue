<script setup lang="ts">
const props = defineProps<{
  to?: string | null
  icon?: string
  button?: boolean
  secondary?: boolean
}>()
const componentName = computed(() => {
  return props.to ? resolveComponent('NuxtLink') : 'button'
})
const primary = computed(() => !props.secondary)
</script>
<template>
  <component
    :is="componentName"
    :to="to"
    :class="[
      'cursor-pointer flex items-center justify-center gap-2 transition-all duration-300',
      'disabled:pointer-events-none',
      {
        'hover:text-blue-500 disabled:opacity-30': !button,
        'py-1.5 px-5.5 min-h-[3rem] rounded-lg': button,
        'font-bold text-base/none tracking-wide text-center': button,
        'bg-green-800 text-white': button && primary,
        'hover:bg-green-900 hover:shadow-xl': button && primary,
        'disabled:bg-black/10 disabled:text-black/30 disabled:shadow-none':
          button && primary,
        'border-2 border-black/10 text-black': button && secondary,
        'hover:bg-black/10': button && secondary,
        'disabled:border-black/10 disabled:text-black/30': button && secondary,
      },
    ]"
  >
    <Icon v-if="icon" :name="icon" />
    <slot />
  </component>
</template>
