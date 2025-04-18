export const getSortingData = <T extends { order?: number | null }>(
  data: T[],
): T[] => {
  return data
    .map((item, order) => ({
      ...item,
      order,
    }))
    .filter((item) => data[item.order].order !== item.order)
}

export const getSortedItems = <T extends { id: string; order?: number | null }>(
  items: T[],
  list: T[],
): T[] => {
  return items
    .map((item) => ({
      ...item,
      order: list.find((i) => i.id === item.id)?.order ?? item.order ?? 0,
    }))
    .sort((a, b) => a.order - b.order)
}

export const sortEntities = async <
  T extends { id: string; order?: number | null },
>(
  items: Ref<T[] | undefined>,
  data: T[],
  entity: string,
) => {
  if (items.value?.length) {
    const list = getSortingData(data)
    if (list.length) {
      items.value = getSortedItems(items.value, list)
      await $fetch(`/api/wishlist/${entity}/sort`, {
        method: 'POST',
        body: {
          list,
          entity,
        },
      })
    }
  }
}

export const removeEntity = (id: string, entity: string) => {
  return $fetch(`/api/wishlist/${entity}/remove`, {
    method: 'POST',
    body: {
      id,
    },
  })
}
