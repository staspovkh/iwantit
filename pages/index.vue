<script setup lang="ts">
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

const wishlistName = ref()
const { execute: createWishlist } = useLazyAsyncData(
  async () => {
    if (wishlistName.value) {
      const result = await $fetch('/api/wishlist/new', {
        method: 'POST',
        body: {
          name: wishlistName.value,
        },
      })
      if (result.ok) {
        getMyWishlists()
      }
      return result
    }
  },
  {
    immediate: false,
  },
)

const deleteWishlist = async (id: string) => {
  const result = await $fetch('/api/wishlist/remove', {
    method: 'DELETE',
    body: {
      id,
    },
  })
  if (result.ok) {
    getMyWishlists()
  }
}
</script>
<template>
  <div class="overflow-hidden">
    <input v-model="wishlistName" class="border" type="text" />
    <Action @click="createWishlist()">createWishlist</Action>
    <ul class="mt-4">
      <li
        v-for="wishlist in myWishlists"
        :key="wishlist.id"
        class="flex items-center gap-1"
      >
        <Action
          icon="ic:outline-delete-forever"
          title="Remove"
          @click="deleteWishlist(wishlist.id)"
        />
        <span>{{ wishlist.name }}</span>
      </li>
    </ul>
  </div>
</template>
