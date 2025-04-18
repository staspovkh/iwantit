import type { InputCheckbox, InputTemplate, InputText } from '~/types'
import { type RuleExpression, useField } from 'vee-validate'

export const useFormElement = <T extends string | boolean>(
  props: InputText | InputCheckbox,
  defaultType = 'text',
  validationRules?: () => boolean | string,
) => {
  const getValidationRules = (props: InputTemplate): RuleExpression<T> => {
    const resultRules: RuleExpression<T> = {}

    if (props.required) {
      resultRules.required = true
    }

    if (props.minlength || props.maxlength) {
      resultRules.length = {
        length:
          props.minlength === props.maxlength ? props.minlength : undefined,
        minLength: props.minlength,
        maxLength: props.maxlength,
      }
    }

    if (props.pattern) {
      resultRules.pattern = {
        pattern: props.pattern,
      }
    }

    if (props.type === 'email') {
      resultRules.email = true
    }

    if (props.type === 'date' && (props.min || props.max)) {
      resultRules.datePeriod = { min: props.min, max: props.max }
    }

    return resultRules
  }

  const fieldType = computed(() => props.type ?? defaultType)
  const fieldId = computed(() => `${fieldType.value}-${props.id ?? props.name}`)
  const fieldName = computed(() => props.name ?? fieldId.value)
  const fieldRules = computed(() => getValidationRules(props))

  const { value, handleBlur, handleChange, resetField, errorMessage, checked } =
    useField<T>(() => fieldName.value, validationRules || fieldRules.value, {
      type:
        fieldType.value === 'checkbox' || fieldType.value === 'radio'
          ? fieldType.value
          : 'default',
      initialValue: props.value as T,
      checkedValue: true as T,
      uncheckedValue: false as T,
      validateOnValueUpdate: true,
      label: computed(() => props.label),
    })

  return {
    fieldType,
    fieldId,
    fieldName,
    fieldRules,
    value,
    checked,
    handleBlur,
    handleChange,
    resetField,
    errorMessage: computed(() => errorMessage.value ?? props.errorMessage),
  }
}
