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
const sortingItems = ref<Wishlist[]>([])

const toggleSorting = (enable?: boolean) => {
  if (enable ?? !sortingMode.value) {
    sortingItems.value = [...(wishlists.value ?? [])]
    sortingMode.value = true
    if (sortingItems.value.length) {
      nextTick(() => {
        useSortable('#grid', sortingItems, {
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
    <WishlistLayout
      v-if="user"
      :title="$t('account.wishlists.title')"
      :loading="loading"
    >
      <template #actions>
        <Action icon="ic:outline-bookmark-border" :to="`/account/tags`" />
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
          :title="$t('global.sort')"
          @click="toggleSorting()"
        />
        <Action
          icon="ic:outline-plus"
          :title="$t('global.add')"
          @click="openModal()"
        />
      </template>
      <template v-if="wishlists.length" #grid>
        <Tile
          v-for="wishlist in sortingMode ? sortingItems : wishlists"
          :key="wishlist.id"
          :title="wishlist.name"
          :image="wishlist.item?.[0]?.picture?.[0]"
          :link="sortingMode ? undefined : `/${wishlist.slug || wishlist.id}`"
        >
          <template #actions>
            <Action
              icon="ic:outline-delete-forever"
              :title="$t('global.remove')"
              :disabled="sortingMode"
              @click="!sortingMode && removeWishlist(wishlist.id)"
            />
            <Action
              icon="ic:outline-edit"
              :title="$t('global.edit')"
              :disabled="sortingMode"
              @click="!sortingMode && openModal(wishlist)"
            />
          </template>
        </Tile>
      </template>
      <Modal
        :title="wishlistToEdit ? 'global.edit' : 'global.add'"
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
