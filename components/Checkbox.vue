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
  <div
    :class="[
      'relative font-bold',
      { 'flex justify-between items-center': fancy },
    ]"
  >
    <span v-if="fancy && label" class="self-center">
      <span v-if="required" class="text-error">* </span>
      {{ $t(label) }}
    </span>
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
      <span
        v-if="fancy"
        class="border-6 border-gray-200 bg-gray-500 text-xs/4 font-bold text-center uppercase"
      >
        <span
          class="flex items-end w-[6em] pt-[0.7em] mt-[-0.7em] overflow-hidden"
        >
          <span
            :class="[
              'relative flex items-center justify-center w-1/2 h-[2.5em]',
              'cursor-pointer select-none transition-all ',
              'before:absolute before:bottom-0 before:right-full before:w-[0.5em] before:h-full',
              'before:origin-[100%_50%] before:bg-gray-400 before:skew-y-[-64deg]',
              {
                'bg-gray-300 translate-x-[0.2em] translate-y-[-0.35em]':
                  !reactiveChecked,
                'rotate-[15deg] skew-x-[15deg] scale-x-[0.9] scale-y-[0.96]':
                  !reactiveChecked,
                'bg-green-700 text-white ': reactiveChecked,
              },
            ]"
          >
            {{ $t('global.yes') }}
          </span>
          <span
            :class="[
              'relative flex items-center justify-center w-1/2 h-[2.5em]',
              'cursor-pointer select-none transition-all ',
              'before:absolute before:bottom-0 before:left-full before:w-[0.5em] before:h-full',
              'before:origin-[0%_50%] before:bg-gray-400 before:skew-y-[64deg]',
              {
                'bg-gray-300 translate-x-[-0.2em] translate-y-[-0.35em]':
                  reactiveChecked,
                'rotate-[-15deg] skew-x-[-15deg] scale-x-[0.9] scale-y-[0.96]':
                  reactiveChecked,
                'bg-error text-white': !reactiveChecked,
              },
            ]"
          >
            {{ $t('global.no') }}
          </span>
        </span>
      </span>
      <template v-else>
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
        <span v-if="label" class="self-center">
          <span v-if="required" class="text-error">* </span>
          {{ $t(label) }}
        </span>
      </template>
    </label>
    <div v-if="error && errorMessage" class="mt-2 font-bold text-error ml-8">
      {{ errorMessage }}
    </div>
  </div>
</template>
