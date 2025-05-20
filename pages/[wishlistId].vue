<script setup lang="ts">
import Tabs from '~/components/Tabs.vue'
import type { Wishlist, WishlistItem } from '~/types/entities'

const {
  params: { wishlistId },
} = useRoute<'wishlistId'>()

const { user, guestId } = useUser()
const {
  loading: wishlistLoading,
  wishlist,
  categories,
  items,
  getWishlist,
  addItem,
  removeItem,
  addItemReservation,
  removeItemReservation,
  processItemCompletion,
  sortItems,
  selectCategory,
} = useWishlist(String(wishlistId))
const { loading: wishlistsLoading, addWishlist } = useWishlists()
const localePath = useLocalePath()

const loading = computed(() => wishlistLoading.value || wishlistsLoading.value)

onMounted(async () => {
  await getWishlist()
  if (!wishlist.value) {
    return navigateTo(localePath({ name: 'index' }))
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

const itemEditOpen = ref(false)
const itemToEdit = ref<WishlistItem | undefined>()

const openItemEdit = (item?: WishlistItem) => {
  itemEditOpen.value = true
  itemToEdit.value = item
}
const closeItemEdit = () => {
  itemEditOpen.value = false
  itemToEdit.value = undefined
}
const submitItemEdit = async (item: Partial<WishlistItem>) => {
  await addItem({
    id: itemToEdit.value?.id,
    ...item,
  })
  closeItemEdit()
}

const processItemReservation = async (item: WishlistItem, add?: boolean) => {
  if (add) {
    await addItemReservation(item, {
      reserve: user.value?.id ?? guestId.value,
    })
  } else {
    await removeItemReservation(item)
  }
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
          :title="$t('global.edit')"
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
          :title="$t('global.sort')"
          @click="toggleSorting()"
        />
        <Action
          :disabled="sortingMode"
          icon="ic:outline-plus"
          :title="$t('global.add')"
          @click="openItemEdit()"
        />
      </template>
      <div
        v-if="categories.length > 1"
        class="flex items-center justify-center gap-4 mb-8"
      >
        <Tabs
          class="justify-center"
          :names="categories.map((c) => c.name)"
          @click="selectCategory(categories[$event].id)"
        />
      </div>
      <ul
        v-if="sortingMode"
        ref="sortingEl"
        class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 user-select-none"
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
            class="w-full h-full object-cover"
            :src="item.picture?.[0]"
            :alt="item.name"
          />
        </li>
      </ul>
      <div
        v-else
        class="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-4 gap-y-10"
      >
        <WishlistItemTile
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :actions="isOwner"
          :preload="!index"
          @edit="openItemEdit(item)"
          @remove="removeItem(item.id)"
          @complete="processItemCompletion(item, $event)"
          @reserve="processItemReservation(item, $event)"
        />
      </div>
      <Modal
        :title="itemToEdit ? 'global.edit' : 'global.add'"
        :open="itemEditOpen"
        @close="closeItemEdit()"
      >
        <WishlistItemForm
          :item="itemToEdit"
          @submitted="submitItemEdit($event)"
        />
      </Modal>
      <Modal
        title="global.edit"
        :open="wishlist && editOpen"
        @close="editOpen = false"
      >
        <WishlistForm :wishlist="wishlist" @submitted="submitEdit($event)" />
      </Modal>
    </WishlistLayout>
  </div>
</template>
