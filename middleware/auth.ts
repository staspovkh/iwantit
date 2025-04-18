export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  if (!user.value?.id) {
    return navigateTo({ name: 'index' })
  }
})
