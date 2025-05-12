<script setup lang="ts">
import Tabs from '~/components/Tabs.vue'
import type { Wishlist, WishlistItem } from '~/types/entities'

const {
  params: { wishlistId },
} = useRoute<'wishlistId'>()

const { user } = useUser()
const {
  loading: wishlistLoading,
  wishlist,
  categories,
  items,
  getWishlist,
  addItem,
  removeItem,
  sortItems,
  selectCategory,
} = useWishlist(String(wishlistId))
const { loading: wishlistsLoading, addWishlist } = useWishlists()

const loading = computed(() => wishlistLoading.value || wishlistsLoading.value)

onMounted(async () => {
  await getWishlist()
  if (!wishlist.value) {
    return navigateTo({ name: 'index' })
  }
})

const isOwner = computed(() => {
  return wishlist.value?.user === user.value?.id
})

const editOpen = ref(false)

const submitEdit = async (item: Partial<Wishlist>) => {
  if (wishlist.value) {
    await addWishlist({
      ...item,
      id: wishlist.value.id,
    })
    wishlist.value = {
      ...wishlist.value,
      ...item,
    }
  }
  editOpen.value = false
}

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

const submitModal = async (item: Partial<WishlistItem>) => {
  await addItem({
    ...item,
    id: itemToEdit.value?.id,
  })
  closeModal()
}

const sortingMode = ref(false)
const sortingEl = ref<HTMLElement | null>(null)
const sortingItems = ref<WishlistItem[]>([])

const toggleSorting = (enable?: boolean) => {
  if (enable ?? !sortingMode.value) {
    sortingItems.value = [...(items.value ?? [])]
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
    sortItems(sortingItems.value)
    nextTick(() => {
      sortingMode.value = false
      sortingItems.value = []
    })
  }
}

watch(items, () => {
  if (sortingMode.value) {
    toggleSorting(true)
  }
})

definePageMeta({
  keepalive: true,
  key(route) {
    return route.fullPath
  },
})
</script>
<template>
  <div>
    <WishlistLayout v-if="wishlist" :title="wishlist.name" :loading="loading">
      <template v-if="isOwner" #actions>
        <Action
          icon="ic:outline-edit"
          title="Edit"
          :disabled="sortingMode"
          @click="!sortingMode ? (editOpen = true) : void 0"
        />
        <Action
          :class="[
            'rounded-sm',
            {
              'bg-black text-white hover:bg-blue-500 hover:text-white':
                sortingMode,
            },
          ]"
          :disabled="items.length < 2"
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
      </template>
      <div
        v-if="categories.length > 1"
        class="flex items-center justify-center gap-4"
      >
        <Tabs
          :names="categories.map((c) => c.name)"
          @click="selectCategory(categories[$event].id)"
        />
      </div>
      <ul
        v-if="sortingMode"
        ref="sortingEl"
        class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 mt-4 user-select-none"
      >
        <li
          v-for="item in sortingItems"
          :key="item.id"
          :class="[
            'aspect-square border rounded-2xl shadow-md overflow-hidden cursor-pointer',
            'transition-opacity duration-300',
          ]"
        >
          <Image
            v-if="item.picture?.[0]"
            class="w-full h-full object-cover"
            :src="item.picture[0]"
            :alt="item.name"
          />
        </li>
      </ul>
      <div
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4 mt-4"
      >
        <WishlistItem
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :actions="isOwner"
          :preload="!index"
          @edit="openModal(item)"
          @remove="removeItem(item.id)"
        />
      </div>
      <Modal title="Add wishlist item" :open="modalOpen" @close="closeModal()">
        <WishlistItemForm :item="itemToEdit" @submitted="submitModal($event)" />
      </Modal>
      <Modal
        title="Edit wishlist"
        :open="wishlist && editOpen"
        @close="editOpen = false"
      >
        <WishlistForm :wishlist="wishlist" @submitted="submitEdit($event)" />
      </Modal>
    </WishlistLayout>
  </div>
</template>
