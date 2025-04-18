<script setup lang="ts">
import type { Wishlist } from '~/types/entities'

const emit = defineEmits<{ submitted: [Partial<Wishlist>] }>()
const props = defineProps<{ wishlist?: Wishlist }>()

const wishlistModel = reactive({
  name: '',
})

const updateModel = (newWishlist: Partial<Wishlist>) => {
  wishlistModel.name = newWishlist.name ?? wishlistModel.name
}

const submitForm = (data: typeof wishlistModel) => {
  emit('submitted', data)
}

watch(
  () => props.wishlist,
  (newWishlist) => {
    if (newWishlist) {
      updateModel(newWishlist)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <Form
      :model="wishlistModel"
      name="wishlist"
      :button-label="wishlist ? 'update wishlist' : 'add wishlist'"
      @submitted="submitForm($event as typeof wishlistModel)"
    />
  </div>
</template>
