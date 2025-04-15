const EXTRA_SCROLLING_DISTANCE = 16

const getHeaderHeight = () =>
  'siteHeader' in window ? (window.siteHeader as HTMLElement)?.offsetHeight : 0

export const getScrollPosition = (
  position: 'top' | 'left',
  container?: Element | null,
): number => {
  const { body, documentElement } = document
  switch (position) {
    case 'top':
      return (
        container?.scrollTop ??
        window.scrollY ??
        documentElement.scrollTop ??
        body.scrollTop
      )
    case 'left':
      return (
        container?.scrollLeft ??
        window.scrollX ??
        documentElement.scrollLeft ??
        body.scrollLeft
      )
  }
}

export const getElementCoordinates = (
  elem: Element | null,
  container?: Element | null,
) => {
  if (!elem) {
    return null
  }

  const rect = elem.getBoundingClientRect()
  const { body, documentElement } = document
  const scroll = {
    top: getScrollPosition('top', container),
    left: getScrollPosition('left', container),
  }
  const client = {
    top:
      (container as HTMLElement)?.offsetTop ||
      documentElement.clientTop ||
      body.clientTop ||
      0,
    left:
      (container as HTMLElement)?.offsetLeft ||
      documentElement.clientLeft ||
      body.clientLeft ||
      0,
  }

  return {
    top: rect.top + scroll.top - client.top,
    left: rect.left + scroll.left - client.left,
  }
}

const getTargetElement = (
  target?: Ref<HTMLElement | undefined | null> | HTMLElement,
) => {
  if (target) {
    let targetElement
    if ('offsetTop' in target) {
      targetElement = target
    } else if (
      'value' in target &&
      target.value &&
      'offsetTop' in target.value
    ) {
      targetElement = target.value
    }
    if (targetElement?.offsetParent) {
      return targetElement
    }
  }
  return undefined
}

export const scrollToTarget = (
  target?: Ref<HTMLElement | undefined | null> | HTMLElement | number,
  distance = EXTRA_SCROLLING_DISTANCE,
) => {
  let top = 0
  let parent
  if (typeof target === 'number') {
    top = target
  } else if (!target) {
    return
  } else if ('offsetTop' in target) {
    top = target.offsetTop
    parent = target.closest('[data-scrollable]')
  } else if ('value' in target && target.value && 'offsetTop' in target.value) {
    top = target.value.offsetTop
    parent = target.value.closest('[data-scrollable]')
  }

  const container = parent || window
  const headerHeight = parent
    ? parent.querySelector('[data-scrollable-header]')?.clientHeight || 0
    : getHeaderHeight()

  top -= headerHeight + distance
  container.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
}

export const scrollIntoView = (
  target?: Ref<HTMLElement | undefined | null> | HTMLElement,
  distance = EXTRA_SCROLLING_DISTANCE,
  toTop = false,
) => {
  const targetElement = getTargetElement(target)
  if (!targetElement) {
    return
  }
  const parent = targetElement.closest('[data-scrollable]')
  const container = parent || window
  const containerHeight = parent?.clientHeight || window.innerHeight
  const headerHeight = parent
    ? parent.querySelector('[data-scrollable-header]')?.clientHeight || 0
    : getHeaderHeight()
  const bottomDistance = toTop ? containerHeight / 4 : distance

  const targetOffsetTop = getElementCoordinates(targetElement, parent)?.top || 0
  const targetTop = targetOffsetTop - distance - headerHeight
  const targetBottom =
    targetOffsetTop +
    bottomDistance -
    containerHeight +
    targetElement.offsetHeight
  const scrollTop = getScrollPosition('top', parent)

  if (scrollTop > targetTop) {
    container.scrollTo({ top: targetTop, behavior: 'smooth' })
  } else if (scrollTop < targetBottom) {
    container.scrollTo({
      top: toTop ? targetTop : targetBottom,
      behavior: 'smooth',
    })
  }
}
