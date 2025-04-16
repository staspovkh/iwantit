<script setup lang="ts">
const { user } = useUser()
const { loading, wishlists, getWishlists, addWishlist, removeWishlist } =
  useWishlists()

const modalOpen = ref(false)
const wishlistModel = reactive({
  name: '',
})

watch(user, () => getWishlists())
onMounted(() => {
  getWishlists()
})

definePageMeta({
  keepalive: true,
})
</script>
<template>
  <div>
    <WishlistLayout v-if="user" :title="'Wish lists'" :loading="loading">
      <template #actions>
        <Action
          icon="ic:outline-plus"
          title="Add new item"
          @click="modalOpen = true"
        />
      </template>
      <ul
        v-if="wishlists.length"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <li
          v-for="wishlist in wishlists"
          :key="wishlist.id"
          class="tile flex items-center justify-between gap-1 font-bold"
        >
          <Action :to="`/${wishlist.id}`">{{ wishlist.name }}</Action>
          <Action
            icon="ic:outline-delete-forever"
            title="Remove"
            @click="removeWishlist(wishlist.id)"
          />
        </li>
      </ul>
      <Modal title="Add wishlist" :open="modalOpen" @close="modalOpen = false">
        <Form
          :model="wishlistModel"
          name="wishlist"
          button-label="add wishlist"
          @submitted="addWishlist(wishlistModel)"
        />
      </Modal>
    </WishlistLayout>
  </div>
</template>
