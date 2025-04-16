import type { Tables, TablesInsert } from './database.types'

export type User = {
  id: string
  email?: string
  name?: string
  picture?: string
}

export type WishlistItemRow = Omit<
  Tables<'wishlist_item'>,
  'created_at' | 'user'
>
export type WishlistItemInsert = TablesInsert<'wishlist_item'>

export type WishlistItemData = {
  name?: string | null
  description?: string | null
  picture?: string | null
  price?: string | null
  currency?: string | null
  brand?: string | null
  link?: string | null
}

export type WishlistItem = WishlistItemData & {
  id: string
  wishlist: string
  order?: number | null
}

export type Wishlist = {
  id: string
  name: string
  items: WishlistItem[]
  user?: string
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

export type InputValue = string | boolean

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
  value?: InputValue
  placeholder?: string
  min?: string
  max?: string
  minlength?: number
  maxlength?: number
  pattern?: string
}
