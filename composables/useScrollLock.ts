const isIosDevice =
  import.meta.client &&
  window.navigator?.userAgent &&
  /iP(ad|hone|od)|MacIntel/.test(window.navigator.userAgent) &&
  window.navigator.maxTouchPoints > 1
let lastScrollPosition = 0

const setScrollLock = () => {
  nextTick(() => {
    if (document.body.style.overflow === 'hidden') {
      return
    }

    const scrollGap = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollGap) {
      document.body.style.paddingRight = `${scrollGap}px`
    }
    if (isIosDevice) {
      lastScrollPosition = getScrollPosition('top')
      document.documentElement.style.height = '100dvh'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.height = '100%'
      document.body.scrollTop = lastScrollPosition
    }
  })
}

const clearScrollLock = () => {
  document.body.style.paddingRight = ''
  document.body.style.overflow = ''
  if (isIosDevice) {
    document.documentElement.style.height = ''
    document.documentElement.style.overflow = ''
    document.body.style.height = ''
    window.scrollTo(0, lastScrollPosition)
  }
}

export function useScrollLock(open: Ref<boolean>, isChangeLevel = false) {
  if (import.meta.client) {
    watch(
      () => open.value,
      (value) => {
        if (value) {
          setScrollLock()
          return
        }
        clearScrollLock()
      },
      { immediate: true },
    )

    onActivated(() => {
      nextTick(() => {
        if (open.value) {
          setScrollLock()
        }
      })
    })

    if (isChangeLevel) {
      setScrollLock()
    }

    if (!isChangeLevel) {
      onBeforeUnmount(() => {
        if (open.value) {
          clearScrollLock()
        }
      })
    }
  }
}
