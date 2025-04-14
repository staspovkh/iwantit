import { defineRule } from 'vee-validate'

type RuleValue = string | number | boolean | null | undefined
type RuleConfig = {
  required?: boolean
  length?: number
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  invalidValue?: string
  customMessage?: string
}

const rEmail =
  // eslint-disable-next-line
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const validationConfig = () => {
  const prepareMessage = (
    message: string,
    config?: Record<string, string | number | undefined>,
  ) => {
    if (message) {
      return message + Object.values(config || {}).join(' ')
    }
    return message
  }

  defineRule('required', (value: unknown, { customMessage }: RuleConfig) => {
    if (value) {
      return true
    }
    return prepareMessage(customMessage ?? 'forms.errors.required.field')
  })

  defineRule(
    'length',
    (
      value: RuleValue,
      { length, minLength, maxLength, customMessage }: RuleConfig,
    ) => {
      const valueLength = String(value ?? '').length
      if (valueLength > 0) {
        if (typeof length === 'number' && valueLength !== length) {
          return prepareMessage(customMessage ?? 'forms.errors.length', {
            length,
          })
        } else {
          if (typeof minLength === 'number' && valueLength < minLength) {
            return prepareMessage(customMessage ?? 'forms.errors.minlength', {
              length,
            })
          }
          if (typeof maxLength === 'number' && valueLength > maxLength) {
            return prepareMessage(customMessage ?? 'forms.errors.maxlength', {
              maxLength,
            })
          }
        }
      }
      return true
    },
  )

  defineRule(
    'pattern',
    (value: RuleValue, { pattern, customMessage }: RuleConfig) => {
      if (value && pattern && !new RegExp(pattern).test(String(value))) {
        return prepareMessage(customMessage ?? 'forms.errors.parse')
      }
      return true
    },
  )

  defineRule('email', (value: RuleValue, { customMessage }: RuleConfig) => {
    if (value && !rEmail.test(String(value))) {
      return prepareMessage(customMessage ?? 'forms.errors.email.valid')
    }
    return true
  })

  defineRule(
    'datePeriod',
    (value: string, { min, max }: { min?: string; max?: string }, field) => {
      const date = new Date(value).getTime()
      if (min && new Date(min).getTime() > date) {
        return String(
          prepareMessage('forms.errors.common', { name: field.label }),
        )
      }
      if (max && new Date(max).getTime() < date) {
        return String(
          prepareMessage('forms.errors.common', { name: field.label }),
        )
      }
      return true
    },
  )
}
