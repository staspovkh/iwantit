import type { Wishlist, WishlistItem } from '~/types'

export function useWishlist(wishlistId: string) {
  const loading = ref(false)
  const wishlist = ref<Wishlist>()

  const getWishlist = async () => {
    const result = await $fetch('/api/wishlist/get', {
      method: 'POST',
      body: {
        id: wishlistId,
      },
    })
    if (result.ok && result.payload) {
      wishlist.value = {
        id: wishlistId,
        name: result.payload.name,
        items: result.payload.wishlist_item.map((item) =>
          row2WishlistItem({
            ...item,
            wishlist: wishlistId,
          }),
        ),
        user: result.payload.user,
      }
    }
  }

  const addItem = async (item: Partial<WishlistItem>) => {
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
          items,
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

  return {
    loading,
    wishlist,
    getWishlist,
    addItem,
    removeItem,
    sortItems,
  }
}
