<script lang="ts" setup>
import type { InputCheckbox } from '~/types'

const props = withDefaults(defineProps<InputCheckbox>(), {
  value: false,
})
const emit = defineEmits<{
  error: [string]
  'update:checked': [boolean]
}>()

const {
  value: reactiveChecked,
  fieldId,
  fieldName,
  handleChange,
  errorMessage,
  resetField,
} = useFormElement<boolean>(props, 'checkbox')

const inputRef = ref<HTMLInputElement>()

const onChange = (event: Event) => {
  handleChange(event)
  emit('update:checked', reactiveChecked.value)
}

onActivated(() => {
  if (props.value !== reactiveChecked.value) {
    handleChange(props.value)
  }
})

const focusField = (preventScroll = false) =>
  inputRef.value?.focus({ preventScroll })

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== reactiveChecked.value) {
      handleChange(newValue)
    }
  },
)

defineExpose({
  fieldName,
  focusField,
  resetField,
})
</script>

<template>
  <div :class="['relative font-medium text-black/60']">
    <label :class="['flex gap-2 items-start', { 'cursor-pointer': !disabled }]">
      <input
        :id="fieldId"
        ref="inputRef"
        class="absolute top-0 left-0 opacity-0 h-0 w-0"
        type="checkbox"
        :name="name"
        :checked="reactiveChecked"
        :disabled="disabled"
        :required="required"
        :aria-label="label"
        :aria-checked="reactiveChecked"
        :aria-errormessage="errorMessage"
        @change="onChange"
      />
      <div
        :class="[
          'flex w-6 h-6 min-w-[1.5rem] items-center justify-center border-2 rounded',
          {
            'bg-light-100 border-black/70':
              !reactiveChecked && !disabled && !error,
            'bg-black/70 border-transparent text-white':
              reactiveChecked && !disabled && !error,
            'bg-black/10 border-black/30':
              disabled && !reactiveChecked && !error,
            'bg-black/10 border-transparent':
              disabled && reactiveChecked && !error,
            'border-error': error,
          },
        ]"
      >
        <Icon
          name="ic:outline-check"
          :class="{
            'text-transparent': !reactiveChecked,
            'text-light-100': reactiveChecked && !disabled,
            'text-black/30': reactiveChecked && disabled,
          }"
        />
      </div>
      <span class="self-center">
        <span v-if="required" class="text-error">* </span>
        {{ label }}
      </span>
    </label>
    <div
      v-if="error && errorMessage"
      class="mt-2 font-bold text-md/4 text-error ml-8"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
