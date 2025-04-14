import type { Wishlist } from '~/types'

export function useWishlists() {
  const loading = ref(false)
  const wishlists = ref<Wishlist[]>([])

  const getWishlists = async () => {
    const { payload } = await $fetch('/api/wishlist/my')
    wishlists.value =
      payload?.map((item) => {
        const wishlist: Wishlist = {
          id: item.id,
          name: item.name,
          items: [],
        }
        return wishlist
      }) ?? []
  }

  const addWishlist = async (wishlist: Omit<Wishlist, 'id' | 'items'>) => {
    loading.value = true
    const result = await $fetch('/api/wishlist/add', {
      method: 'POST',
      body: wishlist,
    })
    if (result.ok) {
      await getWishlists()
    }
    loading.value = false
  }

  const removeWishlist = async (id: string) => {
    loading.value = true
    const result = await $fetch('/api/wishlist/remove', {
      method: 'POST',
      body: {
        id,
      },
    })
    if (result.ok) {
      await getWishlists()
    }
    loading.value = false
  }

  return {
    loading,
    wishlists,
    getWishlists,
    addWishlist,
    removeWishlist,
  }
}
