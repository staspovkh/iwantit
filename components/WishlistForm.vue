<script setup lang="ts">
import type { Wishlist } from '~/types/entities'

const emit = defineEmits<{ submitted: [Partial<Wishlist>] }>()
const props = defineProps<{ wishlist?: Wishlist }>()

const { model, submitForm } = useEntityForm<Wishlist>(
  {
    name: '',
    public: false,
  },
  toRef(props, 'wishlist'),
  emit,
)
</script>
<template>
  <div>
    <Form
      name="wishlist"
      :model="model"
      :button-label="wishlist ? 'update wishlist' : 'add wishlist'"
      @submitted="submitForm"
    />
  </div>
</template>
