import type { Directive } from 'vue'

export interface FocusElement extends HTMLElement {
  _lastFocused?: HTMLElement
  _keyHandler?: (e: KeyboardEvent) => void
}

const focusableElements =
  'a[href], button, [tabindex="0"], input, select, textarea'

const moveFocus = (e: KeyboardEvent, el: FocusElement) => {
  if (e.key === 'Tab' && !el.contains(e.target as Element)) {
    if (e.shiftKey) {
      ;(
        Array.from(el.querySelectorAll(focusableElements)).at(-1) as HTMLElement
      )?.focus()
    } else {
      ;(el.querySelector(focusableElements) as HTMLElement)?.focus()
    }
  }
}

const addFocusTrapHandling = (el: FocusElement) => {
  if (el._keyHandler) {
    return
  }
  const dataReturnFocus = el.getAttribute('data-return-focus')
  el._lastFocused = (
    dataReturnFocus
      ? document.querySelector(dataReturnFocus)
      : document.activeElement
  ) as HTMLElement
  el._keyHandler = (e: KeyboardEvent) => moveFocus(e, el)
  document.addEventListener('keyup', el._keyHandler)
}

const removeFocusTrapHandling = (el: FocusElement) => {
  if (el._lastFocused) el._lastFocused.focus()
  if (el._keyHandler) {
    document.removeEventListener('keyup', el._keyHandler)
    el._keyHandler = undefined
    el._lastFocused = undefined
  }
}

export const focusTrap: Directive<FocusElement> = {
  mounted(el, binding) {
    if (binding.value) {
      addFocusTrapHandling(el)
    }
  },
  updated(el, binding) {
    if (binding.value) {
      addFocusTrapHandling(el)
    } else {
      removeFocusTrapHandling(el)
    }
  },
  unmounted(el) {
    removeFocusTrapHandling(el)
  },
}
