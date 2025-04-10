import type { CredentialResponse } from 'vue3-google-signin'

export function useUser() {
  const {
    loggedIn,
    user,
    fetch: refreshSession,
    clear: logout,
  } = useUserSession()

  const login = (params: CredentialResponse) => {
    if (params.credential) {
      $fetch('/api/logintest', {
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
    user,
    loggedIn,
    login,
    logout,
  }
}
