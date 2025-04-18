<script setup lang="ts">
import type { WishlistTag } from '~/types/entities'

const emit = defineEmits<{ submitted: [Partial<WishlistTag>] }>()
const props = defineProps<{ tag?: WishlistTag }>()

const { model, submitForm } = useEntityForm<WishlistTag>(
  {
    name: '',
  },
  toRef(props, 'tag'),
  emit,
)
</script>
<template>
  <div>
    <Form
      :model="model"
      name="wishlist-tag"
      :button-label="tag ? 'update wishlist tag' : 'add wishlist tag'"
      @submitted="submitForm"
    />
  </div>
</template>
