import type { EntityType } from '~/types/entities'

export function useEntity<T extends { id: string; order?: number | null }>(
  type: EntityType,
  id: string,
  children?: EntityType[],
) {
  const loading = ref(false)
  const entity = useState<T | null>(`${type}-${id}`, () => null)

  const get = async (force?: boolean) => {
    if (!entity.value || force) {
      loading.value = true
      const { payload } = await $fetch(`/api/wishlist/${type}/get`, {
        method: 'POST',
        body: {
          id,
          children,
        },
      })
      if (payload) {
        entity.value = payload as T
      }
      loading.value = false
    }
  }

  return {
    loading,
    entity,
    get,
  }
}
