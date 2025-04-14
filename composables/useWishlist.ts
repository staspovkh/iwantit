import type { Wishlist, WishlistItemData } from '~/types'

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
        items: result.payload.wishlist_item.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? undefined,
          picture: item.picture?.[0],
          price: item.price?.toString() ?? undefined,
          currency: item.currency ?? undefined,
          link: item.link ?? undefined,
          brand: item.brand ?? undefined,
        })),
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

  return {
    loading,
    wishlist,
    getWishlist,
    addItem,
    removeItem,
    parseItem,
  }
}
