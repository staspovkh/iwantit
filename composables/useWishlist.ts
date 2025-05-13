import type { Wishlist, WishlistItem, WishlistTag } from '~/types/entities'

type WishlistExt = Wishlist & {
  item?: WishlistItem[]
  tag?: WishlistTag[]
}

export function useWishlist(wishlistId: string) {
  const wishlist = useState<WishlistExt | null>(
    `wishlist-${wishlistId}`,
    () => null,
  )
  const wishlistLoading = ref(false)

  const getWishlist = async (force?: boolean) => {
    if (!wishlist.value || force) {
      wishlistLoading.value = true
      const { payload } = await $fetch(`/api/wishlist`, {
        method: 'POST',
        body: {
          id: wishlistId,
        },
      })
      if (payload) {
        wishlist.value = payload
      }
      wishlistLoading.value = false
    }
  }

  const {
    loading: itemLoading,
    entities: wishlistItems,
    add: addItemEntity,
    remove: removeItem,
    sort: sortItems,
  } = useEntities<WishlistItem>(
    'item',
    computed(
      () =>
        wishlist.value?.item?.map((item) => ({
          ...item,
          tag: item.tag
            ?.map(
              (id) => wishlist.value?.tag?.find((t) => t.id === id)?.name ?? '',
            )
            .filter(Boolean),
        })) ?? [],
    ),
    {
      key: wishlistId,
      callback: getWishlist,
    },
  )

  const loading = computed(() => wishlistLoading.value || itemLoading.value)

  const addItem = async (item: Partial<WishlistItem>) => {
    await addItemEntity({ ...item, wishlist: wishlistId })
  }

  const categoryId = ref<string | undefined>()
  const categories = computed(() =>
    [
      {
        id: undefined,
        name: 'All',
      },
      ...(wishlist.value?.tag
        ?.filter((tag) =>
          wishlistItems.value.some((item) =>
            item.tag?.some((tagName) => tagName === tag.name),
          ),
        )
        .map((tag) => ({
          id: tag.id,
          name: tag.name ?? '',
        })) ?? []),
    ].map((category) => ({
      ...category,
      selected: category.id === categoryId.value,
    })),
  )
  const items = computed(() => {
    if (!categoryId.value) {
      return wishlistItems.value
    }
    const categoryName = wishlist.value?.tag?.find(
      (tag) => tag.id === categoryId.value,
    )?.name
    return wishlistItems.value.filter((item) =>
      item.tag?.find((tagName) => tagName === categoryName),
    )
  })
  const selectCategory = (id?: string) => {
    categoryId.value = id
  }

  const addItemReservation = async (
    item: WishlistItem,
    data: {
      reserve: string
      reserve_message?: string
    },
  ) => {
    await addItemEntity({
      id: item.id,
      ...data,
    })
  }

  const removeItemReservation = async (item: WishlistItem) => {
    await addItemEntity({
      id: item.id,
      reserve: null,
      reserve_message: null,
    })
  }

  const addItemCompletion = async (item: WishlistItem, completed?: boolean) => {
    await addItem({
      ...item,
      completed: Boolean(completed),
    })
  }

  return {
    loading,
    wishlist,
    categories,
    items,
    getWishlist,
    addItem,
    removeItem,
    addItemReservation,
    removeItemReservation,
    addItemCompletion,
    sortItems,
    selectCategory,
  }
}
