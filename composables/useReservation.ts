import type { WishlistItem } from '~/types/entities'

export function useReservation() {
  const { user } = useUser()
  const reservations = useCookie<string[]>('reservations', {
    default: () => [],
    watch: 'shallow',
  })
  const loading = ref(false)

  const addReservation = async (
    id: string,
    data: {
      reserve: string
      reserve_message?: string
    },
  ) => {
    let result
    loading.value = true
    try {
      const { ok, payload } = await $fetch(`/api/reservation/add`, {
        method: 'POST',
        body: {
          id,
          ...data,
        },
      })
      if (ok) {
        result = payload?.[0] as WishlistItem
      }
    } catch {
      // Handle error if needed
    }
    if (result) {
      reservations.value = [...reservations.value, id]
    }
    loading.value = false
    return result
  }

  const removeReservation = async (id: string) => {
    let result
    loading.value = true
    try {
      const { ok, payload } = await $fetch(`/api/reservation/remove`, {
        method: 'POST',
        body: {
          id,
        },
      })
      if (ok) {
        result = payload?.[0] as WishlistItem
      }
    } catch {
      // Handle error if needed
    }
    if (result) {
      reservations.value = reservations.value.filter(
        (reservation) => reservation !== id,
      )
    }
    loading.value = false
    return result
  }

  const checkReservation = (id: string) => {
    return reservations.value.includes(id)
  }

  const clearReservations = () => {
    reservations.value = []
  }

  const get = async (reservedBy: string) => {
    try {
      const { payload } = await $fetch(`/api/wishlist/item/all`, {
        method: 'POST',
        body: {
          reservedBy,
        },
      })
      if (payload) {
        reservations.value = payload.map((item) => item.id)
      }
    } catch {
      // Handle error if needed
    }
  }

  watch(user, () => {
    if (user.value) {
      get(user.value.id)
    }
  })

  return {
    loading: computed(() => loading.value),
    addReservation,
    removeReservation,
    checkReservation,
    clearReservations,
  }
}
