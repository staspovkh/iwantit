<script setup lang="ts">
definePageMeta({
  keepalive: true,
})

const {
  params: { wishlistId },
} = useRoute<'wishlistId'>()

const { data: wishlist, execute: getWishlist } = await useAsyncData(
  `wishlist-${wishlistId}`,
  async () => {
    const result = await $fetch('/api/wishlist/get', {
      method: 'POST',
      body: {
        id: wishlistId,
      },
    })
    return result.payload
  },
  { server: false },
)

onMounted(() => {
  getWishlist()
})

const modalOpen = ref(false)

const itemName = ref('')
const itemDescription = ref('')
const itemLoading = ref(false)

const addItem = async () => {
  if (itemName.value && itemDescription.value) {
    itemLoading.value = true
    const result = await $fetch('/api/wishlistitem/add', {
      method: 'POST',
      body: {
        wishlist: wishlistId,
        name: itemName.value,
        description: itemDescription.value,
      },
    })
    if (result.ok) {
      itemName.value = ''
      itemDescription.value = ''
      await getWishlist()
      modalOpen.value = false
    }
    itemLoading.value = false
  }
}

const removeItem = async (id: string) => {
  itemLoading.value = true
  const result = await $fetch('/api/wishlistitem/remove', {
    method: 'POST',
    body: {
      id,
    },
  })
  if (result.ok) {
    await getWishlist()
  }
  itemLoading.value = false
}
</script>
<template>
  <div>
    <h1 class="text-center text-2xl font-bold">{{ wishlist?.name }}</h1>
    <template v-if="wishlist">
      <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <li
          v-for="item in wishlist.wishlist_item"
          :key="item.id"
          class="tile p-0"
        >
          <div class="p-4">
            <div class="flex justify-between gap-2">
              <h2 class="font-bold">{{ item.name }}</h2>
              <Action
                icon="ic:outline-delete-forever"
                title="Remove"
                @click="removeItem(item.id)"
              />
            </div>
            <p class="text-gray-500">{{ item.description }}</p>
          </div>
        </li>
        <li>
          <Action
            class="tile w-full h-full justify-center"
            icon="ic:outline-plus"
            @click="modalOpen = true"
          >
            add item
          </Action>
        </li>
      </ul>
      <Modal
        title="Add wishlist item"
        :open="modalOpen"
        @close="modalOpen = false"
      >
        <input
          v-model="itemName"
          type="text"
          placeholder="Name"
          class="border"
        />
        <br />
        <input
          v-model="itemDescription"
          type="text"
          placeholder="Description"
          class="border"
        />
        <br />
        <Action @click="addItem()">add wishlist item</Action>
      </Modal>
      <Spinner :loading="itemLoading" />
    </template>
  </div>
</template>
