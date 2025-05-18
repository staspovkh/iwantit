import { getEntity } from '~/server/utils/entity'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  const {
    ok,
    payload: wishlist,
    error,
  } = await getEntity(event, 'wishlist', {
    id,
    children: ['item'],
  })
  if (ok && wishlist) {
    const tagIds = Array.from(
      new Set(wishlist?.item?.flatMap((item) => item.tag ?? [])),
    )
    if (tagIds.length) {
      const { payload: tags } = await getEntities(event, 'tag', {
        ids: tagIds,
      })
      wishlist.tag = tags
    }
    return {
      ok: true,
      payload: wishlist,
    }
  }
  return {
    ok: false,
    payload: null,
    error,
  }
})
