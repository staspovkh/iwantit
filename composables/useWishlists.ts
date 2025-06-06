import type { Wishlist } from '~/types/entities'

export function useWishlists() {
  const {
    loading,
    entities: wishlists,
    get: getWishlists,
    add: addWishlist,
    remove: removeWishlist,
    sort: sortWishlists,
  } = useEntities<Wishlist>('wishlist', undefined, { children: ['item'] })

  return {
    loading,
    wishlists,
    getWishlists,
    addWishlist,
    removeWishlist,
    sortWishlists,
  }
}
