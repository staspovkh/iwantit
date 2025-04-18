export function useEntityForm<T extends object>(
  fields: Partial<T>,
  data?: Ref<Partial<T> | null | undefined>,
  emit?: (_e: 'submitted', _v: Partial<T>) => void,
) {
  const model = shallowReactive<Partial<T>>(fields)

  const updateModel = (values: Partial<T>) => {
    for (const k in model) {
      const key = k as keyof T
      if (key in values) {
        // @ts-expect-error issue with type Reactive
        model[key] = values[key]
      }
    }
  }

  if (data) {
    watch(
      data,
      (newData) => {
        if (newData) {
          updateModel(newData)
        }
      },
      { immediate: true },
    )
  }

  const submitForm = (data: Partial<T>) => {
    if (emit) {
      emit('submitted', data)
    }
  }

  return {
    model,
    updateModel,
    submitForm,
  }
}
