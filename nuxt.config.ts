import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: {
    port: 3005,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-vue3-google-signin',
    'nuxt-auth-utils',
  ],
  fonts: {
    processCSSVariables: true,
    families: [{ name: 'Inter', provider: 'google' }],
  },
  googleSignIn: {
    clientId:
      '64929895773-qrit0c1f2rljcof7jjogb7ik6vg7gdjh.apps.googleusercontent.com',
    // clientSecret: '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'
  },
})
