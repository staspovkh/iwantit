import type { Wishlist, WishlistItem, WishlistItemData } from '~/types'
import type { Tables } from '~/types/database.types'

const transformItem = (
  item: Partial<Tables<'wishlist_item'>>,
): WishlistItem => ({
  id: item.id ?? '',
  name: item.name ?? '',
  description: item.description ?? undefined,
  picture:
    Array.isArray(item.picture) && typeof item.picture[0] === 'string'
      ? item.picture[0]
      : undefined,
  price: item.price?.toString() ?? undefined,
  currency: item.currency ?? undefined,
  link: item.link ?? undefined,
  brand: item.brand ?? undefined,
  order: item.order ?? 0,
})

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
        items: result.payload.wishlist_item.map(transformItem),
        user: result.payload.user,
      }
    }
  }

  const addItem = async (item: WishlistItemData & { id?: string }) => {
    loading.value = true
    const result = await $fetch('/api/wishlistitem/add', {
      method: 'POST',
      body: {
        ...item,
        wishlist: wishlistId,
      },
    })
    if (result.ok) {
      await getWishlist()
    }
    loading.value = false
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

  const parseItem = async (url: string) => {
    loading.value = true
    const result = await $fetch('/api/wishlistitem/parse', {
      method: 'POST',
      body: {
        url,
      },
    })
    loading.value = false
    if (result.ok && result.payload) {
      return {
        ...result.payload,
        link: url,
      }
    }
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
    parseItem,
    sortItems,
  }
}
