import type { Input } from '~/types'

export const fields: Record<string, Input> = {
  name: {
    type: 'text',
    label: 'forms.name',
    required: true,
    minlength: 2,
  },
  description: {
    type: 'textarea',
    label: 'forms.description',
  },
  picture: {
    type: 'text',
    label: 'forms.picture',
  },
  price: {
    type: 'text',
    label: 'forms.price',
    minlength: 1,
    maxlength: 10,
  },
  currency: {
    type: 'text',
    label: 'forms.currency',
    minlength: 1,
    maxlength: 3,
  },
  brand: {
    type: 'text',
    label: 'forms.brand',
    minlength: 2,
  },
  tag: {
    type: 'select',
    label: 'forms.tags',
    options: [],
    mode: 'tags',
    searchable: true,
    createOption: true,
    top: true,
  },
  link: {
    type: 'text',
    label: 'forms.link.label',
    minlength: 2,
  },
  public: {
    type: 'checkbox',
    label: 'forms.public',
    value: false,
    fancy: true,
  },
  level: {
    type: 'select',
    label: 'forms.level',
    options: [
      { value: '0', label: 'wishlist.level.0' },
      { value: '1', label: 'wishlist.level.1' },
      { value: '2', label: 'wishlist.level.2' },
    ],
    top: true,
  },
  reserve: {
    type: 'text',
    label: 'forms.reserve',
    required: true,
    minlength: 2,
  },
  reserve_message: {
    type: 'textarea',
    label: 'forms.reserve.message',
  },
}
