<script setup lang="ts">
import type { WishlistItem, WishlistItemData } from '~/types'

const {
  params: { wishlistId },
} = useRoute<'wishlistId'>()

const { user } = useUser()
const { loading, wishlist, getWishlist, addItem, removeItem, sortItems } =
  useWishlist(String(wishlistId))

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

const sortingMode = ref(false)
const sortingEl = ref<HTMLElement | null>(null)
const sortingItems = ref<WishlistItem[]>([])

const toggleSorting = async () => {
  if (sortingMode.value) {
    sortItems(sortingItems.value)
    nextTick(() => {
      sortingMode.value = false
      sortingItems.value = []
    })
  } else {
    sortingItems.value = [...(wishlist.value?.items ?? [])]
    sortingMode.value = true
    if (sortingItems.value.length) {
      nextTick(() => {
        useSortable(sortingEl, sortingItems, {
          ghostClass: 'opacity-50',
          chosenClass: '',
          animation: 300,
        })
      })
    }
  }
}

definePageMeta({
  keepalive: true,
})
</script>
<template>
  <div>
    <template v-if="wishlist">
      <h1 class="text-center text-2xl font-bold">{{ wishlist.name }}</h1>

      <div class="flex gap-2 justify-end">
        <Action
          :class="[
            'rounded-sm',
            {
              'bg-black text-white hover:bg-blue-500 hover:text-white':
                sortingMode,
            },
          ]"
          :disabled="!wishlist.items.length"
          icon="ic:outline-repeat"
          title="Sort items"
          @click="toggleSorting()"
        />
        <Action
          :disabled="sortingMode"
          icon="ic:outline-plus"
          title="Add new item"
          @click="openModal()"
        />
      </div>
      <ul
        v-if="sortingMode"
        ref="sortingEl"
        class="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-4 mt-4 user-select-none"
      >
        <li
          v-for="item in sortingItems"
          :key="item.id"
          :class="[
            'aspect-square border rounded-2xl shadow-md overflow-hidden cursor-pointer',
            'transition-opacity duration-300',
          ]"
        >
          <NuxtImg class="w-full h-full object-cover" :src="item.picture" />
        </li>
      </ul>
      <ul
        v-else
        class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4 mt-4"
      >
        <li v-for="item in wishlist.items" :key="item.id">
          <WishlistItem
            :item="item"
            :actions="wishlist.user === user?.id"
            @edit="openModal(item)"
            @remove="removeItem(item.id)"
          />
        </li>
      </ul>
      <Modal title="Add wishlist item" :open="modalOpen" @close="closeModal()">
        <WishlistItemForm :item="itemToEdit" @submitted="submitModal($event)" />
      </Modal>
      <Spinner :loading="loading" />
    </template>
  </div>
</template>
