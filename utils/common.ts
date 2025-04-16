type AddListener<T> = {
  target?: (Window & typeof globalThis) | Document | Element
  options?: boolean | AddEventListenerOptions
  handler: () => void
  type: T
}

type RemoveListener = () => void
export const addEvListener = <T extends string>({
  target = window,
  type,
  handler,
  options,
}: AddListener<T>): RemoveListener => {
  target.addEventListener(type, handler, options)
  return () => {
    target.removeEventListener(type, handler, options)
  }
}

export const areArraysSimilar = <T>(array1?: T[], array2?: T[]): boolean => {
  return Boolean(
    array1 &&
      array2 &&
      array1.length === array2.length &&
      array1.every((value) => array2.includes(value)),
  )
}
