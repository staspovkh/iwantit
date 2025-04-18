export const getEntityNewData = <T extends Record<string, any>>(
  data: Partial<T>,
  item?: T,
): Partial<T> | undefined => {
  if (item) {
    const requiredKeys = ['id', 'wishlist']
    const result = (Object.keys(data) as (keyof typeof data)[])
      .filter((key) => {
        return (
          requiredKeys.includes(String(key)) ||
          (Array.isArray(data[key]) &&
            !areArraysSimilar(data[key], item[key])) ||
          data[key] !== item[key]
        )
      })
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
