import type { EntityType } from '~/types/entities'

export function useEntities<T extends { id: string; order?: number | null }>(
  type: EntityType,
  data?: Ref<T[]>,
  options?: {
    key?: string
    callback?: (force?: boolean) => Promise<void>
  },
) {
  const { user } = useUser()

  const loading = ref(false)
  const entities = useState<T[]>(
    `entities-${type}-${options?.key ?? user.value?.id ?? 'guest'}`,
    () => [],
  )

  watch(
    () => data?.value,
    (newData) => {
      if (newData) {
        entities.value = newData
      }
    },
  )

  const get = async (force?: boolean) => {
    if (!entities.value.length || force) {
      loading.value = true
      if (!data) {
        const { payload } = await $fetch(`/api/wishlist/${type}/my`)
        if (payload) {
          entities.value = payload as T[]
        }
      } else if (options?.callback) {
        await options.callback(force)
      }
      loading.value = false
    }
  }

  const add = async (entity: Partial<T>) => {
    const body = getEntityNewData(
      entity,
      entity.id ? entities.value?.find((e) => e.id === entity.id) : undefined,
    )
    if (body) {
      loading.value = true
      const result = await $fetch(`/api/wishlist/${type}/add`, {
        method: 'POST',
        body,
      })
      if (result.ok) {
        await get(true)
      }
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    const result = await removeEntity(id, type)
    if (result.ok) {
      await get(true)
    }
    loading.value = false
  }

  const sort = async (sortedEntities: T[], wait = false) => {
    loading.value = wait
    await sortEntities(entities, sortedEntities, type)
    loading.value = false
  }

  return {
    loading,
    entities,
    get,
    add,
    remove,
    sort,
  }
}
