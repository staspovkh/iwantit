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
    <template v-if="user">
      <h1 class="text-center text-2xl font-bold">Wish lists</h1>
      <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
        <li class="col-span-full flex justify-center">
          <Action button icon="ic:outline-plus" @click="modalOpen = true">
            add wishlist
          </Action>
        </li>
      </ul>
    </template>
    <Modal title="Add wishlist" :open="modalOpen" @close="modalOpen = false">
      <Form
        :model="wishlistModel"
        name="wishlist"
        button-label="add wishlist"
        @submitted="addWishlist(wishlistModel)"
      />
    </Modal>
    <Spinner :loading="loading" />
  </div>
</template>
