<script setup lang="ts">
import type { Wishlist } from '~/types/entities'

const { user } = useUser()
const {
  loading,
  wishlists,
  getWishlists,
  addWishlist,
  removeWishlist,
  sortWishlists,
} = useWishlists()

const modalOpen = ref(false)
const wishlistToEdit = ref<Wishlist | undefined>()

const openModal = (item?: Wishlist) => {
  modalOpen.value = true
  wishlistToEdit.value = item
}

const closeModal = () => {
  modalOpen.value = false
  wishlistToEdit.value = undefined
}

const submitModal = async (item: Partial<Wishlist>) => {
  await addWishlist({
    ...item,
    id: wishlistToEdit.value?.id,
  })
  closeModal()
}

watch(user, () => getWishlists())
onMounted(() => {
  getWishlists()
})

const sortingMode = ref(false)
const sortingEl = ref<HTMLElement | null>(null)
const sortingItems = ref<Wishlist[]>([])

const toggleSorting = (enable?: boolean) => {
  if (enable ?? !sortingMode.value) {
    sortingItems.value = [...(wishlists.value ?? [])]
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
  } else {
    sortWishlists(sortingItems.value)
    nextTick(() => {
      sortingMode.value = false
      sortingItems.value = []
    })
  }
}

definePageMeta({
  keepalive: true,
})
</script>
<template>
  <div>
    <WishlistLayout v-if="user" :title="'Wish lists'" :loading="loading">
      <template #actions>
        <Action icon="ic:outline-bookmark-border" :to="`/tags`" />
        <Action
          :class="[
            'rounded-sm',
            {
              'bg-black text-white hover:bg-blue-500 hover:text-white':
                sortingMode,
            },
          ]"
          :disabled="wishlists.length < 2"
          icon="ic:outline-repeat"
          title="Sort tags"
          @click="toggleSorting()"
        />
        <Action
          icon="ic:outline-plus"
          title="Add new item"
          @click="openModal()"
        />
      </template>
      <ul
        v-if="wishlists.length"
        ref="sortingEl"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <li
          v-for="wishlist in sortingMode ? sortingItems : wishlists"
          :key="wishlist.id"
          :class="[
            'tile flex items-center justify-between gap-1 font-bold',
            {
              'cursor-pointer': sortingMode,
            },
          ]"
        >
          <Action
            :class="['mr-auto', { 'pointer-events-none': sortingMode }]"
            :to="`/${wishlist.id}`"
            >{{ wishlist.name }}</Action
          >
          <Action
            icon="ic:outline-delete-forever"
            title="Remove"
            :disabled="sortingMode"
            @click="!sortingMode && removeWishlist(wishlist.id)"
          />
          <Action
            icon="ic:outline-edit"
            title="Edit"
            :disabled="sortingMode"
            @click="!sortingMode && openModal(wishlist)"
          />
        </li>
      </ul>
      <Modal
        :title="wishlistToEdit ? 'Edit wishlist' : 'Add wishlist'"
        :open="modalOpen"
        @close="closeModal()"
      >
        <WishlistForm
          :wishlist="wishlistToEdit"
          @submitted="submitModal($event)"
        />
      </Modal>
    </WishlistLayout>
  </div>
</template>
