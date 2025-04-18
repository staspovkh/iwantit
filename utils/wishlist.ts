import type { WishlistItem } from '~/types/entities'

export const parseWishlistItem = async (
  url: string,
): Promise<Partial<WishlistItem>> => {
  try {
    const result = await $fetch('/api/wishlist/parse', {
      method: 'POST',
      body: {
        url,
      },
    })
    if (result.ok && result.payload) {
      return {
        ...result.payload,
        link: url,
      }
    }
  } catch {
    /* empty */
  }
  return {
    link: url,
  }
}
