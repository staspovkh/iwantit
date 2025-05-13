import type { InputCheckbox, InputSelect, InputText } from '~/types'

export const fields: Record<string, InputText | InputCheckbox | InputSelect> = {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
    minlength: 2,
  },
  description: {
    type: 'textarea',
    label: 'Description',
  },
  picture: {
    type: 'text',
    label: 'Image URL',
  },
  price: {
    type: 'text',
    label: 'Price',
    placeholder: '0.00',
    minlength: 1,
    maxlength: 10,
  },
  currency: {
    type: 'text',
    label: 'Currency',
    placeholder: 'UAH',
    minlength: 1,
    maxlength: 3,
  },
  brand: {
    type: 'text',
    label: 'Brand',
    minlength: 2,
  },
  tag: {
    type: 'text',
    label: 'Tag',
    placeholder: 'tag1, tag2',
  },
  link: {
    type: 'text',
    label: 'Link',
    minlength: 2,
  },
  public: {
    type: 'checkbox',
    label: 'Public',
    value: false,
    fancy: true,
  },
  level: {
    type: 'select',
    label: 'level',
    options: [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
    ],
    top: true,
  },
  reserve: {
    type: 'text',
    label: 'Name',
    required: true,
    minlength: 2,
  },
  reserve_message: {
    type: 'textarea',
    label: 'Message',
  },
}
