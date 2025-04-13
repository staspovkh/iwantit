import type { InputText } from '~/types'

export const fields: Record<string, InputText> = {
  name: {
    name: 'name',
    type: 'text',
    label: 'Name',
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    required: true,
  },
}
