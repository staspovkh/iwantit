import type { Wishlist, WishlistItem } from '~/types/entities'

type WishlistExt = Wishlist & {
  item?: WishlistItem[]
}

export function useWishlist(wishlistId: string) {
  const {
    loading: wishlistLoading,
    entity: wishlist,
    get: getWishlistEntity,
  } = useEntity<WishlistExt>('wishlist', wishlistId, ['item'])

  const { loading: tagsLoading, tags, getTags } = useTags()

  const getWishlist = async (force?: boolean) => {
    await Promise.all([getWishlistEntity(force), getTags(force)])
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
            ?.map((id) => tags.value.find((t) => t.id === id)?.name ?? '')
            .filter(Boolean),
        })) ?? [],
    ),
    {
      key: wishlistId,
      callback: getWishlist,
    },
  )

  const loading = computed(
    () => wishlistLoading.value || tagsLoading.value || itemLoading.value,
  )

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
      ...tags.value.filter((tag) =>
        wishlistItems.value.some((item) =>
          item.tag?.some((tagName) => tagName === tag.name),
        ),
      ),
    ].map((category) => ({
      ...category,
      selected: category.id === categoryId.value,
    })),
  )
  const items = computed(() => {
    if (!categoryId.value) {
      return wishlistItems.value
    }
    const categoryName = tags.value.find(
      (tag) => tag.id === categoryId.value,
    )?.name
    return wishlistItems.value.filter((item) =>
      item.tag?.find((tagName) => tagName === categoryName),
    )
  })
  const selectCategory = (id?: string) => {
    categoryId.value = id
  }

  return {
    loading,
    wishlist,
    tags,
    categories,
    items,
    getWishlist,
    addItem,
    removeItem,
    sortItems,
    selectCategory,
  }
}
