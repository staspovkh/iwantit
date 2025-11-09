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
    '@nuxthub/core',
    '@nuxtjs/supabase',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    'nuxt-vue3-google-signin',
    '@nuxtjs/i18n',
  ],
  hub: {
    browser: true,
  },
  supabase: {
    url: 'https://tbzwihzocmryrnxazqng.supabase.co',
    // eslint-disable-next-line max-len
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiendpaHpvY21yeXJueGF6cW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NDc0NjIsImV4cCI6MjA3ODIyMzQ2Mn0.kumV9gC6DGmRMEeABDINHEkR4KjsWk8jhjChNxmINjs',
    redirect: false,
  },
  icon: {
    mode: 'svg',
    componentName: 'NuxtIcon',
  },
  googleSignIn: {
    clientId:
      '64929895773-qrit0c1f2rljcof7jjogb7ik6vg7gdjh.apps.googleusercontent.com',
  },
  i18n: {
    locales: [{ code: 'uk', language: 'uk-UA', file: 'uk-UA.json' }],
    defaultLocale: 'uk',
  },
  experimental: {
    defaults: {
      nuxtLink: {
        activeClass: '',
        exactActiveClass: '',
      },
    },
  },
})
