<script setup lang="ts">
definePageMeta({
  keepalive: true,
})

const { user } = useUser()

const { data: myWishlists, execute: getMyWishlists } = useLazyAsyncData(
  async () => {
    const result = await $fetch('/api/wishlist/my')
    return result.payload
  },
  {
    immediate: false,
  },
)

watch(user, () => getMyWishlists())
onMounted(() => {
  getMyWishlists()
})

const modalOpen = ref(false)

const wishlistName = ref()
const wishlistLoading = ref(false)

const addWishlist = async (name: string) => {
  wishlistLoading.value = true
  const result = await $fetch('/api/wishlist/add', {
    method: 'POST',
    body: {
      name,
    },
  })
  if (result.ok) {
    await getMyWishlists()
    modalOpen.value = false
  }
  wishlistLoading.value = false
}

const removeWishlist = async (id: string) => {
  wishlistLoading.value = true
  const result = await $fetch('/api/wishlist/remove', {
    method: 'POST',
    body: {
      id,
    },
  })
  if (result.ok) {
    await getMyWishlists()
  }
  wishlistLoading.value = false
}
</script>
<template>
  <div>
    <template v-if="myWishlists">
      <h1 class="text-center text-2xl font-bold">Wish lists</h1>
      <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <li
          v-for="wishlist in myWishlists"
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
        <li>
          <Action
            class="tile w-full justify-center"
            icon="ic:outline-plus"
            @click="modalOpen = true"
          >
            add wishlist
          </Action>
        </li>
      </ul>
    </template>
    <Modal title="Add wishlist" :open="modalOpen" @close="modalOpen = false">
      <input v-model="wishlistName" class="border" type="text" />
      <br />
      <Action @click="wishlistName ? addWishlist(wishlistName) : void 0">
        add wishlist
      </Action>
    </Modal>
    <Spinner :loading="wishlistLoading" />
  </div>
</template>
