import type { User } from "~/types"

export function useUser() {
  const requestUrl = useRequestURL()
  const user = useSupabaseUser()

  const login = async () => {
    await useSupabaseClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: requestUrl.toString(),
      },
    })
  }

  const logout = async () => {
    await useSupabaseClient().auth.signOut()
  }

  return {
    user: computed<User | undefined>(() => {
      if (user.value) {
        return {
          id: user.value.id,
          email: user.value.email,
          name: user.value.user_metadata?.full_name || '',
          picture: user.value.user_metadata?.avatar_url || '',
        }
      }
      return undefined
    }),
    login,
    logout,
  }
}
