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
