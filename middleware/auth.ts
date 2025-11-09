export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  if (!user.value?.sub) {
    const localePath = useLocalePath()
    return navigateTo(localePath({ name: 'index' }))
  }
})
