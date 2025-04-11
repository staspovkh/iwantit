export default defineNuxtRouteMiddleware(async (to) => {
  if (to.query.code) {
    await useSupabaseClient().auth.exchangeCodeForSession(
      to.query.code as string,
    )
    return navigateTo(
      { ...to, query: { ...to.query, code: undefined } },
      { redirectCode: 301 },
    )
  }
})
