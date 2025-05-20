<script setup lang="ts">
const props = defineProps<{
  to?: string | null
  icon?: string
  button?: boolean
  secondary?: boolean
  small?: boolean
}>()
const componentName = computed(() => {
  return props.to ? resolveComponent('NuxtLink') : 'button'
})
const primary = computed(() => !props.secondary)
const isExternal = computed(
  () =>
    typeof props.to === 'string' &&
    (props.to.search(/(^\/|^#)/g) === -1 ||
      /^tel/.test(props.to) ||
      /^mailto/.test(props.to)),
)
</script>
<template>
  <component
    :is="componentName"
    :to="to"
    :class="[
      'cursor-pointer flex items-center gap-2 transition-all duration-300',
      'disabled:pointer-events-none',
      {
        '[text-align:inherit] hover:text-sky-800 disabled:opacity-30': !button,
        'font-semibold text-base/none tracking-wide text-center': button,
        'py-1.5 justify-center rounded-lg': button,
        'px-3 min-h-[2rem]': button && small,
        'px-5.5 min-h-[3rem]': button && !small,
        'bg-stone-600 text-white': button && primary,
        'hover:bg-stone-800 hover:shadow-xl': button && primary,
        'disabled:bg-black/10 disabled:text-black/30 disabled:shadow-none':
          button && primary,
        'border-1 border-black/10 text-stone-800': button && secondary,
        'bg-white hover:bg-white/50': button && secondary,
        'disabled:border-black/10 disabled:text-black/30': button && secondary,
      },
    ]"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :type="$attrs.type ?? (to ? undefined : 'button')"
  >
    <Icon v-if="icon" :name="icon" />
    <slot />
  </component>
</template>
