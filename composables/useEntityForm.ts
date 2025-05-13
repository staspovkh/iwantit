import type { FormModel } from '~/types'

export function useEntityForm<T extends object>(
  fields: T,
  data?: Ref<Partial<FormModel<T>> | null | undefined>,
  emit?: (_e: 'submitted', _v: T) => void,
) {
  const model = shallowReactive<T>({ ...fields })

  const updateModel = (values: Partial<FormModel<T>>) => {
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

  const submitForm = (data: unknown) => {
    if (emit) {
      emit('submitted', data as typeof fields)
    }
  }

  return {
    model,
    updateModel,
    submitForm,
  }
}
