<script setup lang="ts">
import type { Wishlist } from '~/types/entities'

const defaultModel = {
  name: '',
  public: false,
}

const emit = defineEmits<{ submitted: [typeof defaultModel] }>()
const props = defineProps<{ wishlist?: Wishlist }>()

const { model, submitForm } = useEntityForm<typeof defaultModel>(
  defaultModel,
  computed(() => entityToForm<Omit<Wishlist, 'id'>>(props.wishlist)),
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
