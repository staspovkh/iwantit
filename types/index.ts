export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

export interface Form {
  name: string
  model: {
    [key: string]: string | boolean | number | null
  }
  id?: string
  buttonLabel?: string
  submitting?: boolean
}

export type InputValue = string | boolean

export interface InputTemplate {
  type:
    | 'textarea'
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'tel'
    | 'checkbox'
    | 'radio'
    | 'select'
  name: string
  id?: string
  min?: string
  max?: string
  minlength?: number
  maxlength?: number
  pattern?: string
  caption?: string
  required?: boolean
  disabled?: boolean

  fieldId?: string
  label?: string
  placeholder?: string
  error?: boolean
  errorMessage?: string
  inputSize?: 'small' | 'medium' | 'tiny'
}

export interface InputText extends InputTemplate {
  value?: string
  placeholder?: string
}

export interface InputCheckbox extends InputTemplate {
  value?: boolean
  fancy?: boolean
}

export interface InputSelect extends InputTemplate {
  value?: string
  options: {
    label: string
    value: string
  }[]
  top?: boolean
}
