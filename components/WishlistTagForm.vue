<script setup lang="ts">
import type { WishlistTag } from '~/types/entities'

const emit = defineEmits<{ submitted: [Partial<WishlistTag>] }>()
const props = defineProps<{ tag?: WishlistTag }>()

const tagModel = reactive({
  name: '',
})

const updateModel = (newTag: Partial<WishlistTag>) => {
  tagModel.name = newTag.name ?? tagModel.name
}

const submitForm = (data: typeof tagModel) => {
  emit('submitted', data)
}

watch(
  () => props.tag,
  (newTag) => {
    if (newTag) {
      updateModel(newTag)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <Form
      :model="tagModel"
      name="wishlist-tag"
      :button-label="tag ? 'update wishlist tag' : 'add wishlist tag'"
      @submitted="submitForm($event as typeof tagModel)"
    />
  </div>
</template>
