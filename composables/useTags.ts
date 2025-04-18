import type { WishlistTag } from '~/types/entities'

export function useTags() {
  const {
    loading,
    entities: tags,
    get: getTags,
    add: addTag,
    remove: removeTag,
    sort: sortTags,
  } = useEntities<WishlistTag>('tag')

  return {
    loading,
    tags,
    getTags,
    addTag,
    removeTag,
    sortTags,
  }
}
