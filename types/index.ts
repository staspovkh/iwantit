export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

export interface Form {
  name: string
  model: {
    [key: string]: string | boolean
  }
  id?: string
  buttonLabel?: string
  submitting?: boolean
}

export interface InputTemplate {
  name: string
  id?: string
  fieldId?: string
  label?: string
  caption?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  inputSize?: 'small' | 'medium' | 'tiny'
}

export interface InputText extends InputTemplate {
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
  value?: string | boolean
  placeholder?: string
  min?: string
  max?: string
  minlength?: number
  maxlength?: number
  pattern?: string
}
