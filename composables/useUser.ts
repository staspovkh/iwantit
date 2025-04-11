import type { CredentialResponse } from 'vue3-google-signin'
import type { User } from '~/types'

export function useUser() {
  const {
    loggedIn,
    user,
    fetch: refreshSession,
    clear: logout,
  } = useUserSession()

  const login = (params: CredentialResponse) => {
    if (params.credential) {
      $fetch('/api/login', {
        method: 'POST',
        body: {
          token: params.credential,
        },
      }).then(async () => {
        await refreshSession()
      })
    }
  }

  return {
    user: computed(() => user.value as User | null),
    loggedIn,
    login,
    logout,
  }
}
