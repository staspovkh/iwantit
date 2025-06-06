import type { InputValue } from '~/types'

export const getEntityNewData = <T extends Record<string, unknown>>(
  data: Partial<T>,
  item?: T,
): Partial<T> | undefined => {
  if (item) {
    const requiredKeys = ['id', 'wishlist']
    const result = (Object.keys(data) as (keyof typeof data)[])
      .filter((key) => {
        return (
          requiredKeys.includes(String(key)) ||
          (Array.isArray(data[key]) && Array.isArray(item[key])
            ? !areArraysSimilar(data[key], item[key])
            : data[key] !== item[key])
        )
      })
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: typeof data[key] === 'undefined' ? null : data[key],
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

export const entityToForm = <T extends Record<string, unknown>>(
  entity?: T,
  skip = ['id'],
) => {
  type Result = Record<keyof T, InputValue>
  const result: Partial<Result> = {}
  for (const k in entity) {
    const key = k as keyof Result
    const value = entity[key]
    if (!skip?.includes(String(key))) {
      if (
        Array.isArray(value) ||
        typeof value === 'string' ||
        typeof value === 'boolean'
      ) {
        result[key] = value
      } else if (typeof value === 'number') {
        result[key] = String(value)
      }
    }
  }
  return result
}
