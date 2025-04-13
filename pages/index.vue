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

const wishlistLoading = ref(false)
const wishlistModel = reactive({
  name: '',
})

const addWishlist = async () => {
  wishlistLoading.value = true
  const result = await $fetch('/api/wishlist/add', {
    method: 'POST',
    body: wishlistModel,
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
        @submitted="addWishlist()"
      />
    </Modal>
    <Spinner :loading="wishlistLoading" />
  </div>
</template>
