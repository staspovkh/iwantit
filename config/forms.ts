import type { InputText } from '~/types'

export const fields: Record<string, InputText> = {
  name: {
    name: 'name',
    type: 'text',
    label: 'Name',
    required: true,
    minlength: 2,
  },
  description: {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
  picture: {
    name: 'picture',
    type: 'text',
    label: 'Image URL',
  },
  price: {
    name: 'price',
    type: 'text',
    label: 'Price',
    placeholder: '0.00',
    minlength: 1,
    maxlength: 10,
  },
  currency: {
    name: 'currency',
    type: 'text',
    label: 'Currency',
    placeholder: 'UAH',
    minlength: 1,
    maxlength: 3,
  },
  brand: {
    name: 'brand',
    type: 'text',
    label: 'Brand',
    minlength: 2,
  },
  tag: {
    name: 'tag',
    type: 'text',
    label: 'Tag',
    placeholder: 'tag1, tag2',
  },
  link: {
    name: 'link',
    type: 'text',
    label: 'Link',
    minlength: 2,
  },
}
