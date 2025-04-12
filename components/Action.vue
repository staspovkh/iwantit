<script setup lang="ts">
const props = defineProps<{ to?: string; icon?: string }>()
const componentName = computed(() => {
  return props.to ? resolveComponent('NuxtLink') : 'button'
})
</script>
<template>
  <component
    :is="componentName"
    :to="to"
    class="cursor-pointer hover:text-blue-500"
  >
    <Icon v-if="icon" :name="icon" />
    <slot />
  </component>
</template>
