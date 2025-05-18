export default defineNuxtPlugin({
  name: 'vee-validate',
  enforce: 'post',
  async setup(nuxtApp) {
    const { validationConfig } = await import('~/config/vee-validate')
    return validationConfig(nuxtApp.$i18n as never)
  },
})
