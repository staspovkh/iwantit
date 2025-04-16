import type {
  Wishlist,
  WishlistItem,
  WishlistItemData,
  WishlistTag,
} from '~/types'

export function useWishlist(wishlistId: string) {
  const { user } = useUser()
  const loading = ref(false)
  const wishlist = ref<Wishlist>()
  const tags = useState<WishlistTag[]>(
    `wishlist-tags-${user.value?.id ?? wishlistId}`,
    () => [],
  )

  const getWishlist = async () => {
    const [result, tagsResult] = await Promise.all([
      await $fetch('/api/wishlist/get', {
        method: 'POST',
        body: {
          id: wishlistId,
        },
      }),
      await $fetch('/api/wishlisttag/my'),
    ])
    if (tagsResult.ok && tagsResult.payload) {
      tags.value = tagsResult.payload
    }
    if (result.ok && result.payload) {
      wishlist.value = {
        id: wishlistId,
        name: result.payload.name,
        items: result.payload.wishlist_item.map((item) =>
          row2WishlistItem(
            {
              ...item,
              wishlist: wishlistId,
            },
            tags.value,
          ),
        ),
        user: result.payload.user,
      }
    }
  }

  const addItem = async (item: Partial<WishlistItemData>) => {
    const data = getWishlistItemUpdate(
      {
        ...item,
        wishlist: wishlistId,
      },
      item.id ? wishlist.value?.items.find((i) => i.id === item.id) : undefined,
    )
    if (data) {
      loading.value = true
      const result = await $fetch('/api/wishlistitem/add', {
        method: 'POST',
        body: wishlistItem2Insert(data),
      })
      if (result.ok) {
        await getWishlist()
      }
      loading.value = false
    }
  }

  const removeItem = async (id: string) => {
    loading.value = true
    const result = await $fetch('/api/wishlistitem/remove', {
      method: 'POST',
      body: {
        id,
      },
    })
    if (result.ok) {
      await getWishlist()
    }
    loading.value = false
  }

  const sortItems = async (items: WishlistItem[], wait = false) => {
    if (wishlist.value) {
      const list = items
        .map((item, order) => ({
          id: item.id,
          order,
        }))
        .filter((item) => items[item.order].order !== item.order)
      if (list.length) {
        wishlist.value = {
          ...wishlist.value,
          items: wishlist.value.items
            .map((item) => ({
              ...item,
              order:
                list.find((i) => i.id === item.id)?.order ?? item.order ?? 0,
            }))
            .sort((a, b) => a.order - b.order),
        }
        loading.value = wait
        await $fetch('/api/wishlistitem/sort', {
          method: 'POST',
          body: {
            list: items
              .map((item, order) => ({
                id: item.id,
                order,
              }))
              .filter((item) => items[item.order].order !== item.order),
          },
        })
        loading.value = false
      }
    }
  }

  const categoryId = ref<string | undefined>()
  const categories = computed(() =>
    [
      {
        id: undefined,
        name: 'All',
      },
      ...tags.value.filter((tag) =>
        wishlist.value?.items.some((item) =>
          item.tag?.some((t) => t.id === tag.id),
        ),
      ),
    ].map((category) => ({
      ...category,
      selected: category.id === categoryId.value,
    })),
  )
  const items = computed(() => {
    if (!categoryId.value) {
      return wishlist.value?.items ?? []
    }
    return (
      wishlist.value?.items.filter((item) =>
        item.tag?.find((t) => t.id === categoryId.value),
      ) ?? []
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
