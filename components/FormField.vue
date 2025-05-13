<script setup lang="ts">
import type { InputCheckbox, InputSelect, InputText } from '~/types'
import type { Input } from '#components'

const props = defineProps<InputText | InputCheckbox | InputSelect>()

const formFieldRef = ref<typeof Input>()
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
