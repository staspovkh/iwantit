export type InputValue = string | string[] | boolean

export type FormModel<T> = Record<keyof T, InputValue>

export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

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
    | 'hidden'
    | 'tag'
  name?: string
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
  value?: string | string[]
  options?: {
    label: string
    value: string
  }[]
  top?: boolean
  mode?: 'single' | 'multiple' | 'tags'
  searchable?: boolean
  createOption?: boolean
}

export type Input = InputText | InputCheckbox | InputSelect

export type FieldsExt = Record<string, Partial<Input> | undefined>

export interface Form {
  name: string
  model: Record<string, InputValue>
  fieldsExt?: FieldsExt
  id?: string
  buttonLabel?: string
  submitting?: boolean
}
