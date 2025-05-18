<script setup lang="ts">
import type { Input } from '~/types'
import type { Input as InputComponent } from '#components'

const props = defineProps<Input>()

const formFieldRef = ref<typeof InputComponent>()
const formFieldComponent = computed(() => {
  switch (props.type) {
    case 'checkbox':
      return resolveComponent('Checkbox')
    case 'radio':
      return resolveComponent('Radio')
    case 'select':
      return resolveComponent('Select')
    default:
      return resolveComponent('Input')
  }
})

defineExpose({
  fieldName: computed(() => formFieldRef.value?.fieldName),
  focusField: computed(() => formFieldRef.value?.focusField),
  resetField: computed(() => formFieldRef.value?.resetField),
})
</script>
<template>
  <component :is="formFieldComponent" v-bind="$props" ref="formFieldRef">
    <slot />
  </component>
</template>
