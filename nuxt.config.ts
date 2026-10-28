// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
  ],

  devtools: { enabled: false },

  compatibilityDate: '2026-10-15',

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        ai: {
          binding: 'AI',
        },
      },
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['node', '@cloudflare/workers-types'],
      },
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
