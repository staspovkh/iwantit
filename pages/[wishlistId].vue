<script setup lang="ts">
import type { WishlistItem, WishlistItemData } from '~/types'

const {
  params: { wishlistId },
} = useRoute<'wishlistId'>()

const { user } = useUser()
const { loading, wishlist, getWishlist, addItem, removeItem } = useWishlist(
  String(wishlistId),
)

onMounted(() => {
  getWishlist()
})

const modalOpen = ref(false)
const itemToEdit = ref<WishlistItem | undefined>()

const openModal = (item?: WishlistItem) => {
  modalOpen.value = true
  itemToEdit.value = item
}

const closeModal = () => {
  modalOpen.value = false
  itemToEdit.value = undefined
}

const submitModal = async (item: WishlistItemData) => {
  await addItem({
    ...item,
    id: itemToEdit.value?.id,
  })
  closeModal()
}

definePageMeta({
  keepalive: true,
})
</script>
<template>
  <div>
    <template v-if="wishlist">
      <h1 class="text-center text-2xl font-bold">{{ wishlist.name }}</h1>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <WishlistItem
          v-for="item in wishlist.items"
          :key="item.id"
          :item="item"
          :actions="wishlist.user === user?.id"
          @edit="openModal(item)"
          @remove="removeItem(item.id)"
        />
        <div class="col-span-full flex justify-center">
          <Action button icon="ic:outline-plus" @click="openModal()">
            add item
          </Action>
        </div>
      </div>
      <Modal title="Add wishlist item" :open="modalOpen" @close="closeModal()">
        <WishlistItemForm :item="itemToEdit" @submitted="submitModal($event)" />
      </Modal>
      <Spinner :loading="loading" />
    </template>
  </div>
</template>
