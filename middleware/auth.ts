export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  if (!user.value?.id) {
    const localePath = useLocalePath()
    return navigateTo(localePath({ name: 'index' }))
  }
})
