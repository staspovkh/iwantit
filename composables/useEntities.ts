import type { EntityType } from '~/types/entities'

export function useEntities<T extends { id: string; order?: number | null }>(
  type: EntityType,
  data?: Ref<T[]>,
  options?: {
    key?: string
    children?: string[]
    callback?: (_force?: boolean) => Promise<void>
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
        try {
          const { payload } = await $fetch(`/api/wishlist/${type}/all`, {
            method: 'POST',
            body: {
              children: options?.children,
            },
          })
          if (payload) {
            entities.value = payload as T[]
          }
        } catch {
          // Handle error if needed
        }
      } else if (options?.callback) {
        await options.callback(force)
      }
      loading.value = false
    }
  }

  const update = (entity?: T) => {
    if (entity) {
      const entityIndex = entities.value.findIndex((e) => e.id === entity.id)
      if (entityIndex) {
        entities.value[entityIndex] = {
          ...entities.value[entityIndex],
          ...entity,
        }
      } else {
        entities.value = [...entities.value, entity]
      }
    }
  }

  const add = async (entity: Partial<T>, force?: boolean) => {
    let success = false
    const body = getEntityNewData(
      entity,
      entity.id ? entities.value?.find((e) => e.id === entity.id) : undefined,
    )
    if (body) {
      loading.value = true
      try {
        const result = await $fetch(`/api/wishlist/${type}/add`, {
          method: 'POST',
          body,
        })
        if (result.ok) {
          update(result.payload?.[0])
          if (force) {
            await get(true)
          }
          success = true
        }
      } catch {
        success = false
      }
      loading.value = false
    }
    return success
  }

  const remove = async (id: string, force?: boolean) => {
    loading.value = true
    const result = await removeEntity(id, type)
    if (result.ok) {
      entities.value = entities.value.filter((entity) => entity.id !== id)
      if (force) {
        await get(true)
      }
    }
    loading.value = false
  }

  const sort = async (sortedEntities: T[], wait = false) => {
    loading.value = wait
    await sortEntities(entities, sortedEntities, type)
    loading.value = false
  }

  return {
    loading: computed(() => loading.value),
    entities: computed(() => entities.value),
    get,
    update,
    add,
    remove,
    sort,
  }
}
