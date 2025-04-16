import type { WishlistItem, WishlistItemInsert, WishlistItemRow } from '~/types'

export const wishlistItem2Insert = (
  item: Partial<WishlistItem>,
): WishlistItemInsert => {
  const { picture, price, ...rest } = item
  if (typeof picture === 'string') {
    rest.picture = picture ? [picture] : null
  }
  if (typeof price === 'string') {
    rest.price = price ? Number(price) : null
  }
  return rest
}

export const row2WishlistItem = (item: WishlistItemRow): WishlistItem => ({
  ...item,
  picture:
    Array.isArray(item.picture) && typeof item.picture[0] === 'string'
      ? item.picture[0]
      : undefined,
  price: item.price?.toString(),
})

export const getWishlistItemUpdate = (
  data: Partial<WishlistItem>,
  item?: WishlistItem,
): Partial<WishlistItem> | undefined => {
  if (item) {
    const requiredKeys = ['id', 'wishlist']
    const result = (Object.keys(data) as (keyof typeof data)[])
      .filter((key) => requiredKeys.includes(key) || data[key] !== item[key])
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: data[key],
        }),
        {},
      )
    if (Object.keys(result).some((key) => !requiredKeys.includes(key))) {
      return result
    }
    return undefined
  }
  return data
}

export const parseWishlistItem = async (url: string) => {
  try {
    const result = await $fetch('/api/wishlistitem/parse', {
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
