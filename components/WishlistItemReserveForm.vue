<script setup lang="ts">
import type { FieldsExt } from '~/types'
import type { WishlistItem } from '~/types/entities'
const { user } = useUser()

const defaultModel = {
  reserve: user.value?.name || '',
  reserve_message: '',
}

const emit = defineEmits<{
  submitted: [typeof defaultModel]
}>()
const props = defineProps<{ item: WishlistItem }>()

const { model, submitForm } = useEntityForm<typeof defaultModel>(
  defaultModel,
  computed(() => {
    const result = entityToForm<Omit<WishlistItem, 'id'>>(props.item)
    if (!result.reserve) {
      result.reserve = user.value?.id || ''
    }
    return result
  }),
  emit,
)

const fieldsExt = computed<FieldsExt>(() => {
  if (model.reserve === user.value?.id) {
    return {
      reserve: {
        type: 'hidden',
      },
    }
  }
  return {}
})
</script>
<template>
  <div>
    <UserTile v-if="user" :user="user" class="mb-6" />
    <Form
      :model="model"
      :fields-ext="fieldsExt"
      name="wishlist-item-reserve"
      button-label="Reserve"
      @submitted="submitForm"
    />
  </div>
</template>
