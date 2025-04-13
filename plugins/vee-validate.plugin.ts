export default defineNuxtPlugin({
  name: 'vee-validate',
  enforce: 'post',
  async setup() {
    const { validationConfig } = await import('~/config/vee-validate')
    return validationConfig()
  },
})
