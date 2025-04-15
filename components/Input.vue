<script lang="ts" setup>
import type { InputText, InputValue } from '~/types'

const props = withDefaults(defineProps<InputText>(), {
  value: '',
})
const emit = defineEmits<{
  error: [string]
  'update:value': [InputValue]
  'update:enter': [InputValue]
}>()

const {
  value: reactiveValue,
  fieldId,
  fieldType,
  fieldName,
  handleBlur,
  handleChange,
  resetField,
} = useFormElement(props, 'text')
const computedValue = computed(() => reactiveValue.value as typeof props.value)

const inputRef = ref<HTMLInputElement>()

watch(
  () => props.value,
  (newVal) => {
    if (newVal !== reactiveValue.value) {
      handleChange(newVal)
    }
  },
)

let skipWatcherOnce = false

watch(reactiveValue, () => {
  if (skipWatcherOnce) {
    skipWatcherOnce = false
    return
  }
  emit('update:value', computedValue.value)
})

onActivated(() => {
  if (props.value !== reactiveValue.value) {
    skipWatcherOnce = true
    reactiveValue.value = String(props.value)
  }
})

const onChange = (event: Event | string) => {
  handleChange(event)
  emit('update:value', computedValue.value)
}

const onInput = (event: Event | string) => {
  handleChange(event, Boolean(props.error))
}

const onAutofill = () => {
  if (computedValue.value) {
    onChange(String(computedValue.value))
  }
}

const onBlur = (event: Event) => {
  handleBlur(event, true)
}

const onKeydownEnter = (event: Event) => {
  handleBlur(event, true)
  emit('update:enter', computedValue.value)
}

// Fix for android devices, because v-model doesn't work
const onCompositionUpdate = (event: CompositionEvent) => {
  onInput(event?.data)
}

const focusField = (preventScroll = false) =>
  inputRef.value?.focus({ preventScroll })

const isTextarea = computed(() => props.type === 'textarea')
const inputTag = computed(() => (isTextarea.value ? 'textarea' : 'input'))

defineExpose({
  inputRef,
  fieldValue: reactiveValue,
  fieldName,
  focusField,
  resetField,
})
</script>

<template>
  <InputTemplate v-bind="$props" :field-id="fieldId">
    <template #content-input="{ className }">
      <div :class="className">
        <component
          :is="inputTag"
          :id="fieldId"
          ref="inputRef"
          :class="[
            'w-full min-h-6 font-body font-medium text-base/6 bg-transparent appearance-none transition-colors',
            'placeholder-opacity-100 placeholder-dark-100/30 placeholder:transition-colors',
            'focus-visible:outline-none focus-visible:placeholder-dark-100/60',
            {
              'text-dark-100/60 group-hover:placeholder-dark-100/60': !disabled,
              'text-dark-100/30': disabled,
              'h-24': isTextarea,
            },
          ]"
          :type="fieldType"
          :name="fieldName"
          :value="reactiveValue"
          :disabled="disabled"
          :required="required"
          :placeholder="placeholder"
          :minlength="minlength"
          :maxlength="maxlength"
          :min="min"
          :max="max"
          @change="onChange"
          @input="onInput"
          @blur="onBlur"
          @keydown.enter.prevent="onKeydownEnter"
          @compositionupdate="onCompositionUpdate"
          @animationstart="onAutofill()"
        />
      </div>
    </template>
    <slot />
  </InputTemplate>
</template>
