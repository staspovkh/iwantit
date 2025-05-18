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
      button-label="global.save"
      @submitted="submitForm"
    />
  </div>
</template>
