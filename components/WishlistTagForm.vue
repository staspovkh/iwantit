<script setup lang="ts">
import type { WishlistTag } from '~/types/entities'

const defaultModel = {
  name: '',
}

const emit = defineEmits<{ submitted: [typeof defaultModel] }>()
const props = defineProps<{ tag?: WishlistTag }>()

const { model, submitForm } = useEntityForm<typeof defaultModel>(
  defaultModel,
  computed(() => entityToForm<Omit<WishlistTag, 'id'>>(props.tag)),
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
