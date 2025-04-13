<script setup lang="ts">
import type { Input } from '#components'
import type { Form } from '~/types'

import { useForm } from 'vee-validate'
import { fields as fieldDefinitions } from '~/config/forms'

const emit = defineEmits<{
  submitted: [Record<string, string | boolean>]
  'update:model': [Record<string, string | boolean>]
}>()
const props = defineProps<Form>()

const fieldRef = ref<(typeof Input)[]>([])
const formId = computed(() => props.id || `form-${props.name}`)

const {
  values: rawValues,
  resetForm,
  validate,
  setFieldValue,
  errors: rawErrors,
} = useForm({
  initialValues: toRef(props, 'model'),
})
const values = computed(() =>
  'value' in rawValues
    ? rawValues.value
    : (rawValues as Record<string, string | boolean>),
)
const errors = computed(
  () => rawErrors.value as Record<string, string | undefined>,
)

const keys = computed(() => Object.keys(props.model))
const fields = computed(() =>
  keys.value
    .map((key) => ({
      ...fieldDefinitions[key],
      value: values.value[key],
      form: formId.value,
      error: Boolean(errors.value[key]),
      errorMessage: errors.value[key],
    }))
    .filter((field) => field.name),
)

const ready = computed(() =>
  fields.value.every(
    (field) =>
      (!field.required || values.value[field.name]) &&
      !errors.value[field.name],
  ),
)

const validateForm = async () => (await validate()).valid

const updateFormModel = (newValues: Record<string, string | boolean>) => {
  Object.keys(newValues).forEach((key) => {
    const val = values.value[key]
    if (typeof val !== 'undefined') {
      // eslint-disable-next-line vue/no-mutating-props
      props.model[key] = val
    }
  })
}

watch(rawValues, (newValues) => {
  updateFormModel(newValues)
  emit('update:model', values.value)
})

watch(
  () => props.model,
  (newValues, oldValues) => {
    for (const [key, newVal] of Object.entries(newValues)) {
      if (newVal !== oldValues[key] && typeof newVal !== 'undefined') {
        setFieldValue(
          `value.${key}`,
          newVal,
          typeof oldValues[key] !== 'undefined',
        )
      }
    }
  },
)

const handleSubmit = () => {
  return validateForm().then((valid) => {
    if (valid) {
      updateFormModel(values.value)
      emit('submitted', values.value)
    }
    return valid
  })
}

const getField = (fieldName: string) => {
  for (const field of fieldRef.value) {
    if (field.fieldName === fieldName) {
      return field
    }
  }
  return undefined
}

const resetField = (fieldName: string) => getField(fieldName)?.resetField()

defineExpose({
  ready,
  validateForm,
  resetField,
  resetForm,
})
</script>
<template>
  <form
    :id="formId"
    :name="name"
    novalidate
    @submit.prevent="handleSubmit()"
    @reset.prevent="resetForm()"
  >
    <Input
      v-for="field in fields"
      :key="field.name"
      v-bind="field"
      ref="fieldRef"
      class="mb-6"
    />
    <Action
      v-if="buttonLabel"
      button
      type="submit"
      :disabled="!ready || submitting"
    >
      {{ buttonLabel }}
    </Action>
    <slot />
  </form>
</template>
