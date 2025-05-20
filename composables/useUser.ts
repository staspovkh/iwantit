import type { User } from '~/types'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

export function useUser() {
  const requestUrl = useRequestURL()
  const user = useSupabaseUser()

  const guestId = useCookie<string>('guestId', {
    expires: new Date(Date.now() + ONE_YEAR),
  })

  const login = async (token?: string) => {
    const supabase = useSupabaseClient()
    if (token) {
      return supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
      })
    }
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: requestUrl.toString(),
      },
    })
  }

  const logout = () => {
    return useSupabaseClient().auth.signOut()
  }

  watch(
    user,
    () => {
      if (!user.value) {
        if (!guestId.value) {
          guestId.value = crypto.randomUUID()
        }
      } else {
        guestId.value = ''
      }
    },
    { immediate: true },
  )

  return {
    user: computed<User | undefined>(() => {
      if (user.value) {
        return {
          id: user.value.id,
          email: user.value.email,
          name: user.value.user_metadata?.full_name ?? '',
          picture: user.value.user_metadata?.avatar_url ?? '',
        }
      }
      return undefined
    }),
    guestId: computed(() => guestId.value),
    login,
    logout,
  }
}
