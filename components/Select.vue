<script lang="ts" setup>
import type { InputSelect, InputValue } from '~/types'
import Multiselect from '@vueform/multiselect'

const props = defineProps<InputSelect>()
const emit = defineEmits<{
  'update:value': [string | string[]]
}>()

const { t } = useI18n()
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

const selectModel = ref<string | string[]>('')
watch(
  () => props.mode,
  (mode) => {
    selectModel.value = mode === 'tags' ? [] : ''
  },
  { immediate: true },
)

const options = computed(() =>
  props.options?.map((option) => ({
    ...option,
    label: t(option.label),
  })),
)

const areValuesIdentical = (a?: InputValue, b?: InputValue) => {
  return Array.isArray(a) && Array.isArray(b) ? areArraysSimilar(a, b) : a === b
}

watch(
  () => props.value,
  (newVal) => {
    if (newVal) {
      if (!areValuesIdentical(newVal, reactiveValue.value)) {
        reactiveValue.value = newVal
      }
      if (!areValuesIdentical(newVal, selectModel.value)) {
        selectModel.value = newVal
      }
    }
  },
  { immediate: true },
)

const onChange = (value: string | string[]) => {
  handleChange(value, Boolean(value))
  emit(
    'update:value',
    Array.isArray(reactiveValue.value)
      ? reactiveValue.value
      : String(reactiveValue.value),
  )
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
      'relative w-full flex items-center outline-none' +
      (props.disabled ? '' : ' cursor-pointer'),
    singleLabel:
      'flex items-center absolute inset-0 pl-4 pr-8 pointer-events-none',
    singleLabelText:
      'overflow-ellipsis overflow-hidden block text-black whitespace-nowrap max-w-full',
    multipleLabel:
      'flex items-center absolute inset-0 pl-4 pr-8 pointer-events-none',
    tags: 'flex flex-wrap items-center gap-2 grow-1 shrink-1 px-3 py-2 text-black',
    tag: '',
    tagDisabled: '',
    tagRemove: '',
    tagRemoveIcon: '',
    tagsSearchWrapper: 'grow-1 shrink-1 h-full relative',
    tagsSearch: 'absolute inset-0 w-full outline-none',
    tagsSearchCopy: 'inline-block h-px invisible w-full whitespace-pre-wrap',
    placeholder:
      'flex items-center absolute inset-0 pl-4 pr-8 leading-none pointer-events-none',
    caret:
      'text-black/70 mr-3 ml-auto pointer-events-none transition-transform duration-150',
    clear: '',
    clearIcon: '',
    spinner: '',
    dropdown:
      'absolute -inset-x-px z-20 overflow-auto flex flex-col gap-3 max-h-[15rem] ' +
      'border-x border-black/70 bg-white ' +
      'before:block before:h-px before:bg-black/10 before:sticky after:block ' +
      (props.top
        ? 'bottom-full border-t rounded-t-lg before:order-1 after:-order-1'
        : 'top-full border-b rounded-b-lg'),
    dropdownTop: '',
    dropdownHidden: 'hidden',
    options: 'flex flex-col p-0 list-none',
    optionsTop: '',
    option:
      'flex items-center justify-between gap-2 px-4 py-2 cursor-pointer ' +
      'after:h-2.5 after:w-1.5 after:rotate-45',
    optionPointed: 'bg-black/5 text-black',
    optionSelected:
      'font-bold text-black after:border-b-2 after:border-r-2 after:border-green-500',
    optionDisabled: 'text-black/30 cursor-not-allowed',
    optionSelectedPointed:
      'bg-black/5 font-bold text-black after:border-b-2 after:border-r-2 after:border-green-500',
    optionSelectedDisabled:
      'font-bold text-black/30 cursor-not-allowed after:border-b-2 after:border-r-2',
    noOptions: 'px-4',
    noResults: 'px-4 ' + (props.top ? 'mb-3' : 'mt-3'),
    fakeInput: 'sr-only',
    spacer: 'h-[3rem] -my-px',
    assist: 'sr-only',
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
        v-model="selectModel"
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
        :placeholder="placeholder ? $t(placeholder) : undefined"
        :name="fieldName"
        :aria="{
          'aria-label': label ? $t(label) : label,
          'aria-disabled': disabled,
          'aria-invalid': !!errorMessage,
          'aria-errormessage':
            error && errorMessage ? `#${fieldId}-error` : undefined,
          'aria-multiselectable': null,
        }"
        :classes="multiselectClasses"
        :mode="mode"
        :searchable="searchable"
        :create-option="createOption"
        :no-results-text="$t('search.noresults')"
        native-support
        @change="onChange"
        @open="onOpen"
        @close="onClose"
      >
        <template #caret>
          <Icon
            :class="[
              multiselectClasses.caret,
              {
                'rotate-180': open,
              },
            ]"
            name="ic:baseline-keyboard-arrow-down"
          />
        </template>
        <template #tag="{ option, handleTagRemove, disabled }">
          <span
            :class="['flex items-center gap-1 rounded-sm bg-black/5 px-2 py-1']"
            tabindex="-1"
            @keyup.enter="handleTagRemove(option, $event)"
          >
            <span>{{ option.label }}</span>
            <Action
              class="text-black/60"
              icon="ic:outline-close"
              :title="$t('global.remove')"
              :disabled="disabled || option.disabled"
              @click.stop="handleTagRemove(option, $event)"
            />
          </span>
        </template>
      </Multiselect>
    </template>
    <slot />
  </InputTemplate>
</template>
