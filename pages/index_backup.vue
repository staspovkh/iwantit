<script setup lang="ts">
import type { Wishlist } from '~/types/entities'

const loading = ref(false)
const wishlists = ref<Wishlist[]>([])
const getPublicWishlists = async () => {
  loading.value = true
  try {
    const { payload } = await $fetch(`/api/wishlist/public`, {
      method: 'POST',
    })
    if (payload) {
      wishlists.value = payload
    }
  } catch {
    // Handle error if needed
  }
  loading.value = false
}

onMounted(() => {
  getPublicWishlists()
})

definePageMeta({
  keepalive: true,
})
</script>
<template>
  <div>
    <WishlistLayout :title="$t('wishlist.title')" :loading="loading">
      <template v-if="wishlists.length" #grid>
        <Tile
          v-for="wishlist in wishlists"
          :key="wishlist.id"
          :title="wishlist.name"
          :image="wishlist.item?.[0]?.picture?.[0]"
          :link="`/${wishlist.slug || wishlist.id}`"
        />
      </template>
    </WishlistLayout>
  </div>
</template>
