<script lang="ts" setup>
import type { InputSelect } from '~/types'
import Multiselect from '@vueform/multiselect'

const props = withDefaults(defineProps<InputSelect>(), {
  value: '',
})
const emit = defineEmits<{
  'update:value': [string]
}>()

const {
  value: reactiveValue,
  fieldId,
  fieldName,
  errorMessage,
  handleBlur,
  handleChange,
  resetField,
} = useFormElement(props, 'select')
const multiselect = ref<InstanceType<typeof Multiselect>>()
const open = ref(false)

watch(
  () => props.value,
  (newVal) => {
    if (newVal !== reactiveValue.value) {
      reactiveValue.value = newVal ?? ''
    }
  },
)

const onChange = (value: string) => {
  handleChange(value, Boolean(value))
  emit('update:value', String(reactiveValue.value))
}

const onOpen = () => {
  open.value = true
}

const onClose = () => {
  open.value = false
  handleBlur(undefined, true)
}

const multiselectClasses = computed(() => {
  const isOpen = open.value
  const isError = props.error && !open.value
  const isDisabled = props.disabled && !isError
  const isDefault = !isError && !isDisabled && !isOpen
  return {
    container:
      'relative w-full flex justify-end border border-black/30 rounded-lg text-black/60 ' +
      (isDefault ? 'bg-white ' : '') +
      (isOpen ? 'bg-white border-black/70 ' : '') +
      (isDisabled ? 'bg-black/10 border-black/30 ' : '') +
      (isError ? 'bg-error-light border-error ' : ''),
    containerDisabled: '',
    containerOpen: 'rounded-b-none border-black/70',
    containerOpenTop: 'rounded-t-none border-black/70',
    containerActive: '',
    wrapper:
      'relative w-full flex items-center justify-end outline-none rounded-md' +
      (props.disabled ? '' : ' cursor-pointer'),
    singleLabel:
      'flex items-center absolute inset-0 pl-4 pr-8 pointer-events-none',
    singleLabelText:
      'overflow-ellipsis overflow-hidden block text-black whitespace-nowrap max-w-full',
    multipleLabel:
      'flex items-center absolute inset-0 pl-4 pr-8 pointer-events-none',
    tags: '',
    tag: '',
    tagDisabled: '',
    tagRemove: '',
    tagRemoveIcon: '',
    tagsSearchWrapper: '',
    tagsSearch: '',
    tagsSearchCopy: '',
    placeholder:
      'flex items-center absolute inset-0 pl-4 pr-8 leading-none pointer-events-none',
    caret:
      'text-black/70 mr-3 pointer-events-none transition-transform duration-150',
    clear: '',
    clearIcon: '',
    spinner: '',
    dropdown:
      'absolute -inset-x-px z-20 overflow-auto flex flex-col gap-3 max-h-[15rem] ' +
      'border-x border-black/70 bg-white ' +
      (props.top
        ? 'bottom-full border-t rounded-t-lg'
        : 'top-full border-b rounded-b-lg'),
    dropdownTop: '',
    dropdownHidden: 'hidden',
    options:
      'flex flex-col my-3 p-0 list-none ' +
      'before:block before:h-px before:bg-black/10 before:sticky before:inset-0 ' +
      (props.top ? 'mb-0 before:mt-3 before:order-1' : 'mt-0 before:mb-3'),
    optionsTop: '',
    option:
      'flex items-center justify-between gap-2 px-4 py-2 cursor-pointer ' +
      'after:h-2.5 after:w-1.5 after:rotate-45',
    optionPointed: 'bg-black/5',
    optionSelected:
      'font-bold text-black after:border-b-2 after:border-r-2 after:border-green-500',
    optionDisabled: 'text-black/30 cursor-not-allowed',
    optionSelectedPointed:
      'bg-black/5 font-bold text-black after:border-b-2 after:border-r-2 after:border-green-500',
    optionSelectedDisabled:
      'font-bold text-black/30 cursor-not-allowed after:border-b-2 after:border-r-2',
    noOptions: 'px-3 pb-3',
    noResults: '',
    fakeInput: 'sr-only',
    spacer: 'h-[3rem] -my-px',
  }
})

const focusField = (preventScroll = false) => {
  if (
    multiselect.value &&
    'wrapper' in multiselect.value &&
    multiselect.value.wrapper instanceof HTMLElement
  ) {
    multiselect.value?.wrapper.focus({ preventScroll })
  }
}

defineExpose({
  select: (option: string) => {
    multiselect.value?.select(option)
  },
  fieldName,
  focusField,
  resetField,
})
</script>

<template>
  <InputTemplate v-bind="$props" :field-id="fieldId">
    <template #content-input>
      <Multiselect
        :id="fieldId"
        ref="multiselect"
        :class="[
          'asf-scrollbar',
          'text-left font-medium outline-none select-none',
          {
            'md:max-w-[18.75rem]': inputSize === 'medium',
            'max-w-[13.5rem]': inputSize === 'small',
            'max-w-[10.5rem]': inputSize === 'tiny',
          },
        ]"
        :value="reactiveValue"
        :can-clear="false"
        :can-deselect="false"
        :open-direction="top ? 'top' : 'bottom'"
        :options="options"
        :required="required"
        :disabled="disabled"
        :placeholder="placeholder"
        :name="fieldName"
        :aria="{
          'aria-label': label,
          'aria-disabled': disabled,
          'aria-invalid': !!errorMessage,
          'aria-errormessage':
            error && errorMessage ? `#${fieldId}-error` : undefined,
          'aria-multiselectable': null,
        }"
        :classes="multiselectClasses"
        native-support
        @change="onChange"
        @open="onOpen"
        @close="onClose"
      >
        <template #caret>
          <Icon
            :class="[
              multiselectClasses.caret,
              'transition-transform duration-300',
              {
                'rotate-180': open,
              },
            ]"
            name="ic:baseline-keyboard-arrow-down"
          />
        </template>
      </Multiselect>
    </template>
    <slot />
  </InputTemplate>
</template>
